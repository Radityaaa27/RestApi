<?php

namespace Tests\Feature;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResourceTest extends TestCase
{
    use RefreshDatabase;

    protected function authHeader(): array
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_guest_cannot_list_resources(): void
    {
        $this->getJson('/api/resources')->assertStatus(401);
    }

    public function test_authenticated_user_can_list_resources(): void
    {
        Resource::factory()->count(3)->create();

        $response = $this->withHeaders($this->authHeader())
            ->getJson('/api/resources');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_authenticated_user_can_create_resource(): void
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/resources', [
                'name' => 'Test Resource',
                'status' => 'active',
                'description' => 'A sample description.',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Test Resource');

        $this->assertDatabaseHas('resources', ['name' => 'Test Resource']);
    }

    public function test_create_resource_fails_validation(): void
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/resources', [
                'name' => '',
                'status' => 'unknown-status',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'status']);
    }

    public function test_authenticated_user_can_update_resource(): void
    {
        $resource = Resource::factory()->create();

        $response = $this->withHeaders($this->authHeader())
            ->putJson("/api/resources/{$resource->id}", [
                'name' => 'Updated Name',
                'status' => 'inactive',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Name');
    }

    public function test_authenticated_user_can_delete_resource(): void
    {
        $resource = Resource::factory()->create();

        $response = $this->withHeaders($this->authHeader())
            ->deleteJson("/api/resources/{$resource->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('resources', ['id' => $resource->id]);
    }
}
