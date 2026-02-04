<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('client')->latest();

        if ($request->has('q')) {
            $search = $request->get('q');
            $query->where(function($q) use ($search) {
                $q->where('event_type', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhereHas('client', function($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('surname', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        // Totals are calculated in the model's booted method
        return Order::create($request->all());
    }

    public function show(Order $order)
    {
        return $order->load('client');
    }

    public function update(Request $request, Order $order)
    {
        $order->update($request->all());
        return $order;
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->noContent();
    }

    /**
     * Upload a reference photo with comment for an order.
     */
    public function uploadReference(Request $request, Order $order)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,gif,webp|max:10240', // 10MB, only JPG/PNG/GIF/WebP
            'comment' => 'nullable|string|max:1000',
        ]);

        $file = $request->file('file');
        $comment = $request->input('comment', '');
        $dir = 'order-references/' . $order->id;
        $path = $file->store($dir, 'public');

        $references = $order->references ?? [];
        $references[] = ['path' => $path, 'comment' => $comment];
        $order->references = $references;
        $order->save();

        return response()->json([
            'path' => $path,
            'comment' => $comment,
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    /**
     * Delete a reference by index and remove file from storage.
     */
    public function deleteReference(Order $order, int $index)
    {
        $references = $order->references ?? [];
        if (!isset($references[$index])) {
            return response()->json(['message' => 'Reference not found'], 404);
        }

        $ref = $references[$index];
        if (!empty($ref['path']) && Storage::disk('public')->exists($ref['path'])) {
            Storage::disk('public')->delete($ref['path']);
        }

        array_splice($references, $index, 1);
        $order->references = $references;
        $order->save();

        return response()->noContent();
    }
}
