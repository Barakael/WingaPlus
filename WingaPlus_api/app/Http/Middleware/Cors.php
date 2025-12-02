<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allowed origins for reference; we'll echo the incoming Origin when present to
        // support credentialed requests during development and remote hosting.
        $allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            // include the hosted API origin (with port) to be explicit
            'http://95.111.247.129:8070',
            'http://95.111.247.129'
        ];

        $origin = $request->headers->get('Origin');

        // Build typical CORS headers
        $allowMethods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
        $allowHeaders = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';

        // Preflight handling: always respond with CORS headers and echo Origin when present
        if ($request->getMethod() === 'OPTIONS') {
            $response = response()->noContent(204);
            // For mobile apps (no Origin header) or browsers, allow the origin
            if ($origin) {
                // For credentialed requests you must echo the exact Origin
                $response->headers->set('Access-Control-Allow-Origin', $origin);
            } else {
                // Mobile apps don't send Origin, allow all
                $response->headers->set('Access-Control-Allow-Origin', '*');
            }
            $response->headers->set('Access-Control-Allow-Methods', $allowMethods);
            $response->headers->set('Access-Control-Allow-Headers', $allowHeaders);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Vary', 'Origin');
            return $response;
        }

        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        // For mobile apps (no Origin header) or browsers, allow the origin
        if ($origin) {
            // Echo the incoming origin so browsers accept credentialed responses
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } else {
            // Mobile apps don't send Origin header, allow all
            $response->headers->set('Access-Control-Allow-Origin', '*');
        }
        $response->headers->set('Access-Control-Allow-Methods', $allowMethods);
        $response->headers->set('Access-Control-Allow-Headers', $allowHeaders);
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Vary', 'Origin');

        return $response;
    }
}
