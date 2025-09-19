# Link-in-bio (Netlify JSON Config)

## Cấu trúc
- `index.html` — đọc `config.json` và render nút.
- `admin.html` — chỉnh sửa danh sách nút, tải xuống `config.json` hoặc lưu qua Netlify Function.
- `config.json` — dữ liệu các nút.
- `netlify/functions/save-config.js` — Function để commit `config.json` lên GitHub.
- `netlify.toml` — khai báo thư mục Functions.

## Triển khai
1. Commit toàn bộ thư mục này lên GitHub và kết nối Netlify.
2. Trong Netlify → Site settings → Environment variables, thêm:
   - `GITHUB_TOKEN` — PAT có quyền repo.
   - `GITHUB_REPO` — ví dụ `username/reponame`.
   - `GITHUB_BRANCH` — ví dụ `main`.
   - `CONFIG_PATH` — đường dẫn tới file config, mặc định `config.json`.
3. Deploy. Mở `/admin.html` để quản trị.

## Không dùng Function?
- Sửa trong `admin.html`, sau đó bấm **Tải xuống config.json** và commit thủ công.
