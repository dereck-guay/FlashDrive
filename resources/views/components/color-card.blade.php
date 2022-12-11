@php
    $module = \App\Models\Module::getCurrentModule();
@endphp

<div class="w-full rounded p-2 text-white bg-gradient-to-br from-{{ $module->color }} to-slate-500" style="height: {{ $attributes->get('height') ?: '100px' }};">
    {{ $slot }}
</div>
