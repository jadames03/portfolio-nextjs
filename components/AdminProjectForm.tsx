"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Loader2, Tag } from "lucide-react";
import { slugify, dispatchToast } from "../lib/utils";

type AdminProjectFormProps = {
  mode: "create" | "edit";
  tags: { id: string; name: string; slug: string }[];
  project?: {
    id: string;
    title: string;
    slug: string;
    shortDesc: string;
    coverUrl: string | null;
    body: string | null;
    tags: { id: string; name: string; slug: string }[];
  };
};

type FieldErrors = Partial<Record<keyof ProjectPayload, string>>;

type ProjectPayload = {
  title: string;
  slug: string;
  shortDesc: string;
  coverUrl: string;
  body: string;
  tagIds: string[];
};

const EMPTY_PAYLOAD: ProjectPayload = {
  title: "",
  slug: "",
  shortDesc: "",
  coverUrl: "",
  body: "",
  tagIds: []
};

export function AdminProjectForm({ mode, tags, project }: AdminProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formState, setFormState] = useState<ProjectPayload>(() => {
    if (!project) {
      return EMPTY_PAYLOAD;
    }
    return {
      title: project.title,
      slug: project.slug,
      shortDesc: project.shortDesc,
      coverUrl: project.coverUrl ?? "",
      body: project.body ?? "",
      tagIds: project.tags.map((tag) => tag.id)
    };
  });
  const [slugEdited, setSlugEdited] = useState(false);

  const selectedTags = useMemo(() => new Set(formState.tagIds), [formState.tagIds]);

  const handleChange = (field: keyof ProjectPayload) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormState((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !slugEdited) {
        next.slug = slugify(value);
      }
      return next;
    });
    if (field === "slug") {
      setSlugEdited(true);
    }
  };

  const toggleTag = (tagId: string) => {
    setFormState((prev) => {
      const exists = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: exists ? prev.tagIds.filter((id) => id !== tagId) : [...prev.tagIds, tagId]
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      ...formState,
      coverUrl: formState.coverUrl.trim() || "",
      body: formState.body.trim(),
      shortDesc: formState.shortDesc.trim()
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${encodeURIComponent(project!.id)}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.fields) {
          setErrors(data.fields);
        }
        throw new Error(data?.error ?? "Failed to save project.");
      }

      dispatchToast({
        message: mode === "create" ? "Project created." : "Project updated.",
        tone: "success"
      });

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      dispatchToast({
        message: error instanceof Error ? error.message : "Unable to save project.",
        tone: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-slate-200">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            value={formState.title}
            onChange={handleChange("title")}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          {errors.title ? <p className="text-xs text-red-400">{errors.title}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-slate-200">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={formState.slug}
            onChange={handleChange("slug")}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          {errors.slug ? <p className="text-xs text-red-400">{errors.slug}</p> : null}
        </div>
      </section>

      <section className="space-y-2">
        <label htmlFor="shortDesc" className="text-sm font-medium text-slate-200">
          Short description
        </label>
        <textarea
          id="shortDesc"
          name="shortDesc"
          required
          value={formState.shortDesc}
          onChange={handleChange("shortDesc")}
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
        {errors.shortDesc ? <p className="text-xs text-red-400">{errors.shortDesc}</p> : null}
      </section>

      <section className="space-y-2">
        <label htmlFor="coverUrl" className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <ImageIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          Cover URL
        </label>
        <input
          id="coverUrl"
          name="coverUrl"
          value={formState.coverUrl}
          onChange={handleChange("coverUrl")}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          placeholder="https://"
        />
        {errors.coverUrl ? <p className="text-xs text-red-400">{errors.coverUrl}</p> : null}
      </section>

      <section className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium text-slate-200">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          value={formState.body}
          onChange={handleChange("body")}
          rows={6}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          placeholder="Longer markdown-friendly description..."
        />
        {errors.body ? <p className="text-xs text-red-400">{errors.body}</p> : null}
      </section>

      <section className="space-y-3">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Tag className="h-4 w-4 text-slate-400" aria-hidden="true" />
          Tags
        </span>
        <div className="grid gap-2 sm:grid-cols-3">
          {tags.map((tag) => {
            const id = `tag-${tag.slug}`;
            const checked = selectedTags.has(tag.id);
            return (
              <label
                key={tag.id}
                htmlFor={id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500/40 ${
                  checked
                    ? "border-sky-400 bg-sky-500/15 text-sky-100"
                    : "border-slate-700 bg-slate-900/50 text-slate-200 hover:border-sky-400/50"
                }`}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTag(tag.id)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900/70 text-sky-500 focus:ring-sky-500"
                />
                <span>{tag.name}</span>
              </label>
            );
          })}
        </div>
        {errors.tagIds ? <p className="text-xs text-red-400">{errors.tagIds}</p> : null}
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow transition hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving
            </>
          ) : mode === "create" ? (
            "Create project"
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
