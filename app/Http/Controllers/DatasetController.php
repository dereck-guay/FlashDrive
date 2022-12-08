<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DatasetController extends Controller
{
    public function list(Request $request) {
        $model = "\App\Models\\" . ucFirst($request->get('model'));
        $filters = $request->get('filters');
        return json_encode($model::list($filters));
    }

    public function store(Request $request) {
        $model = "\App\Models\\" . ucFirst($request->get('model'));

        if (method_exists($model, 'store')) {
            $newRecord = $model::store($request);
            return json_encode($newRecord);
        }

        $newRecord = $model::create([
            'user_id' => \Auth::id(),
        ]);
        return json_encode($newRecord);
    }

    public function update(Request $request) {
        try {
            $model = "\App\Models\\" . ucFirst($request->get('model'));

            if (method_exists($model, '_update')) {
                $record = $model::_update($request);
                return json_encode($record);
            }

            $records = $request->get('records');
            foreach ($records as $record) {
                $actualRecord = $model::where('id', $record['id'])->first();
                unset($record['id']);
                unset($record['created_at']);
                unset($record['updated_at']);
                unset($record['user_id']);
                foreach ($record as $key => $value)
                    $actualRecord[$key] = $value;

                $actualRecord->save();
            }
        } catch (\Throwable $th) {
            return json_encode(['error']);
        }

        return json_encode(['success']);
    }

    public function destroy(Request $request) {
        $model = "\App\Models\\" . ucFirst($request->get('model'));
        $idToDelete = $request->get('id');

        if (method_exists($model, '_destroy')) {
            $record = $model::_destroy($request);
            return json_encode($record);
        }

        $record = $model::where('id', $idToDelete)->first();
        if ($record == null) return json_encode(['error' => 'DatasetController[Delete]: 404 Record Not Found.']);

        $record->delete();
        return json_encode($record);
    }
}
