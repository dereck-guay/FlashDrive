<?php
    $color = @$attributes->get('color') ?: 'blue-500';
    $route = @$attributes->get('route');
    $isRoute = request()->routeIs($route . '*');
?>

<a
href="{{ route($attributes->get('route')) }}" title="{{ $attributes->get('title') }}"
class="sidebar-link hover:text-{{ $color }} @if($isRoute) bg-gradient-to-br from-slate-700 to-slate-900 text-{{ $color }} @endif">
    <i class="{{ $attributes->get('icon') }}"></i>
</a>
