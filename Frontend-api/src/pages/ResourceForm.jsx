import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../components/common/Toast";
import Navbar from "../components/layout/Navbar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const EMPTY_FORM = { name: "", status: "active", description: "" };

export default function ResourceForm() {
  const [searchParams] = useSearchParams();
  const resourceId = searchParams.get("id");
  const isEditing = Boolean(resourceId);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    api
      .get(`/resources/${resourceId}`)
      .then(({ data }) => setForm(data.data ?? data))
      .catch(() => showToast("Couldn't load this record.", "error"))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the field-level error as soon as the user starts correcting it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await api.put(`/resources/${resourceId}`, form);
        showToast("Changes saved successfully.", "success");
      } else {
        await api.post("/resources", form);
        showToast("Resource created successfully.", "success");
      }
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 422) {
        // Laravel validation errors: { errors: { field: ["message", ...] } }
        const fieldErrors = err.response.data.errors ?? {};
        const flattened = Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0]])
        );
        setErrors(flattened);
      } else {
        showToast("Something went wrong while saving. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <p className="mx-auto max-w-form px-3 py-4 text-body text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="mx-auto max-w-form px-3 py-4">
        <Link
          to="/dashboard"
          className="mb-3 inline-block text-body font-medium text-secondary transition-colors duration-150 hover:text-primary"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-card bg-surface p-4 shadow-card">
          <h1 className="mb-4">{isEditing ? "Edit Resource" : "Create Resource"}</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <section className="border-l-4 border-interactive pl-3">
              <h2 className="mb-2">Basic Information</h2>
              <div className="flex flex-col gap-2">
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="status" className="text-caption font-medium text-secondary">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`w-full rounded-card border bg-surface px-2 py-2 text-body text-primary outline-none transition-colors duration-150 focus:border-interactive ${
                      errors.status ? "border-danger" : "border-border-input"
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {errors.status && <p className="text-caption text-danger">{errors.status}</p>}
                </div>
              </div>
            </section>

            <section className="border-l-4 border-interactive pl-3">
              <h2 className="mb-2">Details</h2>
              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-caption font-medium text-secondary">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className={`w-full rounded-card border bg-surface px-2 py-2 text-body text-primary outline-none transition-colors duration-150 focus:border-interactive ${
                    errors.description ? "border-danger" : "border-border-input"
                  }`}
                />
                {errors.description && (
                  <p className="text-caption text-danger">{errors.description}</p>
                )}
              </div>
            </section>

            {/* Action bar: bottom-right, neutral Cancel + primary Save */}
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button variant="secondary" type="button" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
