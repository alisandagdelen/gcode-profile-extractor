# OrcaSlicer Gcode Profile Recovery

Extract printer, filament, and process profiles from OrcaSlicer gcode files.

## What it does

If you lost your OrcaSlicer profiles but have a gcode file, this tool recovers your settings:
- Printer (machine) profile
- Filament profile
- Process (print) profile

## How to use

1. Open `index.html` in your web browser
2. Drop your `.gcode` file or click to browse
3. Download the recovered profile files

Alternatively, run with a local server:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`

## Import to OrcaSlicer

Copy the downloaded JSON files to your OrcaSlicer user folder:

- **macOS**: `~/Library/Application Support/OrcaSlicer/user/default/`
- **Windows**: `%APPDATA%/OrcaSlicer/user/default/`
- **Linux**: `~/.config/OrcaSlicer/user/default/`

Place files in the appropriate subfolder:
- Printer files → `machine/`
- Filament files → `filament/`
- Process files → `process/`

Restart OrcaSlicer to see your profiles.

## Requirements

Any modern web browser (Chrome, Firefox, Safari, Edge)
