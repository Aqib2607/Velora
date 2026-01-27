<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Traits\ApiResponse;

class AddressController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        return $this->success('Addresses retrieved successfully', $request->user()->addresses);
    }

    public function store(StoreAddressRequest $request)
    {
        if ($request->is_default) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($request->validated());

        return $this->success('Address created successfully', $address, 201);
    }

    public function update(UpdateAddressRequest $request, Address $address)
    {
        if ($request->user()->id !== $address->user_id) {
            return $this->error('Unauthorized', 403);
        }

        if ($request->is_default) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($request->validated());

        return $this->success('Address updated successfully', $address);
    }

    public function destroy(Request $request, Address $address)
    {
         if ($request->user()->id !== $address->user_id) {
            return $this->error('Unauthorized', 403);
        }
        $address->delete();
        return $this->success('Address deleted successfully');
    }
}
