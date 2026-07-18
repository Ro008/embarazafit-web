import json
import pathlib

base = pathlib.Path(__file__).resolve().parent


def esc(v):
    if v is None:
        return "NULL"
    if isinstance(v, (int, float)) and not isinstance(v, bool):
        return str(v)
    s = str(v).replace("'", "''")
    return f"'{s}'"


leads = json.loads((base / "export-leads.json").read_text(encoding="utf-8-sig"))
pagos = json.loads((base / "export-pagos.json").read_text(encoding="utf-8-sig"))
if isinstance(leads, dict):
    leads = [leads]
if isinstance(pagos, dict):
    pagos = [pagos]

lines = [
    "-- Migracion Embarazafit: DocCy Testing -> proyecto propio",
    "-- 1) Ejecuta primero schema.sql en el proyecto NUEVO",
    "-- 2) Luego pega y ejecuta este archivo en SQL Editor del proyecto NUEVO",
    "",
    "begin;",
    "",
]

for r in leads:
    lines.append(
        "insert into embarazafit_leads "
        "(id, nombre, email, telefono, momento, situacion, status, created_at) values ("
        + ", ".join(
            [
                esc(r.get("id")),
                esc(r.get("nombre")),
                esc(r.get("email")),
                esc(r.get("telefono")),
                esc(r.get("momento")),
                esc(r.get("situacion")),
                esc(r.get("status")),
                esc(r.get("created_at")),
            ]
        )
        + ") on conflict (id) do nothing;"
    )

lines.append("")

for r in pagos:
    lines.append(
        "insert into embarazafit_pagos "
        "(id, lead_id, mes, importe, tipo, created_at) values ("
        + ", ".join(
            [
                esc(r.get("id")),
                esc(r.get("lead_id")),
                esc(r.get("mes")),
                esc(r.get("importe")),
                esc(r.get("tipo")),
                esc(r.get("created_at")),
            ]
        )
        + ") on conflict (id) do nothing;"
    )

lines.extend(
    [
        "",
        "commit;",
        "",
        f"-- Leads: {len(leads)} | Pagos: {len(pagos)}",
    ]
)

(base / "migrate-data.sql").write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote migrate-data.sql with {len(leads)} leads and {len(pagos)} pagos")
