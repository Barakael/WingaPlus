<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Allowed origins for reference. We'll echo the incoming Origin when present so
        // credentialed requests from browsers are accepted.
        $allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'http://95.111.247.129:8070',
            'http://95.111.247.129',
        ];

        $origin = $request->headers->get('Origin');

        $allowMethods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
        $allowHeaders = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';

        $headers = [
            // When Origin is present we must echo it for credentialed requests
            'Access-Control-Allow-Origin' => $origin ? $origin : '*',
            'Access-Control-Allow-Methods' => $allowMethods,
            'Access-Control-Allow-Headers' => $allowHeaders,
            'Access-Control-Allow-Credentials' => 'true',
            'Vary' => 'Origin',
        ];

        if ($request->getMethod() === 'OPTIONS') {
            return response()->json(['status' => 'OK (preflight)'], 204, $headers);
        }

        /** @var Response $response */
        $response = $next($request);
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }
        return $response;
    }
}
