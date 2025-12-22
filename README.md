# 🔧 OrcaSlicer Gcode Profile Recovery

Lost your 3D printer profiles? Recover them from your gcode files.

---

## 💡 What it does

This tool extracts your **printer**, **filament**, and **process** settings from any OrcaSlicer gcode file and saves them as importable profiles.

---

## 🚀 How to use

**👉 Visit: https://alisandagdelen.github.io/gcode-profile-extractor/**

1. 📁 Upload your `.gcode` file
2. ⬇️ Download the recovered profiles
3. ✅ Import them back into OrcaSlicer

---

## 📥 Importing profiles to OrcaSlicer

### 1️⃣ Find your OrcaSlicer user folder:

- 🍎 **macOS**: `~/Library/Application Support/OrcaSlicer/user/default/`
- 🪟 **Windows**: `%APPDATA%/OrcaSlicer/user/default/`
- 🐧 **Linux**: `~/.config/OrcaSlicer/user/default/`

### 2️⃣ Copy the downloaded files:

- 🖨️ Printer `.json` files → `machine/` folder
- 🧵 Filament `.json` files → `filament/` folder
- ⚙️ Process `.json` files → `process/` folder

### 3️⃣ Restart OrcaSlicer

Your profiles will appear in the app! 🎉
