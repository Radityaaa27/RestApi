import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/common/Toast";
import Navbar from "../components/layout/Navbar";
import MetricsCard from "../components/dashboard/MetricsCard";
import ResourceTable from "../components/dashboard/ResourceTable";
import Button from "../components/common/Button";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setIsLoading(true);
    try {
      const { data } = await api.get("/resources");
      setResources(data.data ?? data);
    } catch {
      showToast("Couldn't load your resources. Please refresh.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this record? This can't be undone.")) return;
    try {
      await api.delete(`/resources/${id}`);
      setResources((prev) => prev.filter((r) => r.id !== id));
      showToast("Record deleted successfully.", "success");
    } catch {
      showToast("Couldn't delete the record. Please try again.", "error");
    }
  }

  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="mx-auto max-w-6xl px-3 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1>Welcome Back, {user?.name ?? "there"}</h1>
            <p className="text-caption text-secondary">{timestamp}</p>
          </div>
          <Button onClick={() => navigate("/resource/manage")}>+ New Resource</Button>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Left area: core resource table */}
          <div className="lg:col-span-2">
            <h2 className="mb-2">Resources</h2>
            {isLoading ? (
              <div className="rounded-card border border-border bg-surface p-4 text-body text-secondary">
                Loading...
              </div>
            ) : (
              <ResourceTable rows={resources} columns={COLUMNS} onDelete={handleDelete} />
            )}
          </div>

          {/* Right area: quick stats */}
          <div className="flex flex-col gap-2">
            <h2>Overview</h2>
            <MetricsCard label="Total Resources" value={resources.length} />
            <MetricsCard
              label="Active"
              value={resources.filter((r) => r.status === "active").length}
            />
            <MetricsCard
              label="Last Sync"
              value="Just now"
              caption="Auto-refreshes on save"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
