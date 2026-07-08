<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResourceRequest;
use App\Http\Resources\ResourceResource;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * GET /api/resources
     * Powers the table on Dashboard.jsx.
     */
    public function index(Request $request): JsonResponse
    {
        $resources = Resource::latest()->get();

        return response()->json([
            'data' => ResourceResource::collection($resources),
        ]);
    }

    /**
     * POST /api/resources
     * On validation failure, Laravel automatically returns a 422 with
     * { errors: { field: ["message"] } } — this is what ResourceForm.jsx reads.
     */
    public function store(ResourceRequest $request): JsonResponse
    {
        $resource = Resource::create([
            ...$request->validated(),
            'user_id' => $request->user()?->id,
        ]);

        return response()->json([
            'data' => new ResourceResource($resource),
        ], 201);
    }

    /**
     * GET /api/resources/{resource}
     * Used by ResourceForm.jsx when loading an existing record to edit.
     */
    public function show(Resource $resource): JsonResponse
    {
        return response()->json([
            'data' => new ResourceResource($resource),
        ]);
    }

    /**
     * PUT/PATCH /api/resources/{resource}
     */
    public function update(ResourceRequest $request, Resource $resource): JsonResponse
    {
        $resource->update($request->validated());

        return response()->json([
            'data' => new ResourceResource($resource),
        ]);
    }

    /**
     * DELETE /api/resources/{resource}
     */
    public function destroy(Resource $resource): JsonResponse
    {
        $resource->delete();

        return response()->json([
            'message' => 'Resource deleted successfully.',
        ]);
    }
}
