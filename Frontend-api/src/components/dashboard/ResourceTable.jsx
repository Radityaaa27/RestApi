import { useNavigate } from "react-router-dom";

export default function ResourceTable({ rows, columns, onDelete }) {
  const navigate = useNavigate();

  if (!rows.length) {
    return (
      <div className="rounded-card border border-border bg-surface p-4 text-center text-body text-secondary">
        No records yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-canvas">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-2 py-2 text-left text-caption font-bold text-secondary"
              >
                {col.label}
              </th>
            ))}
            <th className="px-2 py-2 text-right text-caption font-bold text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id}
              className={`border-t border-border ${idx % 2 === 1 ? "bg-canvas" : "bg-surface"}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-2 py-2 text-body text-primary">
                  {row[col.key]}
                </td>
              ))}
              <td className="px-2 py-2 text-right">
                <button
                  onClick={() => navigate(`/resource/manage?id=${row.id}`)}
                  className="mr-2 text-body font-medium text-secondary transition-colors duration-150 hover:text-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row.id)}
                  className="text-body font-medium text-danger/80 transition-colors duration-150 hover:text-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
