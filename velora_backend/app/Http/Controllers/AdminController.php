<?php

namespace App\Http\Controllers;

use App\Models\User;

class AdminController extends BaseController
{
    public function index()
    {
        $users = User::paginate(20);

        return $this->success('Users retrieved successfully', $users);
    }
}
