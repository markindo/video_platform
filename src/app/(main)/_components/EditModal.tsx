"use client";

import { SelectInput } from "@/components/core/SelectInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditModalProps {
  video: {
    id: string;
    title: string;
    description: string;
    category?: { name: string };
  };
  onUpdated: () => void;
}

export default function EditModal({ video, onUpdated }: EditModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || "");
  const [category, setCategory] = useState(video.category?.name || "");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(
          data.map((cat: Category) => ({ id: cat.id, label: cat.name }))
        );
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // fetch category when video changes
  useEffect(() => {
    if (!loadingCategories && categories.length > 0 && video.category?.name) {
      const matched = categories.find(
        (cat) => cat.label.toLowerCase() === video.category!.name.toLowerCase()
      );

      if (matched) {
        setSelectedCategory(matched);
        setCategory(matched.label);
      } else {
        const customCat = { id: "custom", label: video.category.name };
        setCategories((prev) => [...prev, customCat]);
        setSelectedCategory(customCat);
        setCategory(video.category.name);
      }
    }
  }, [categories, loadingCategories, video.category]);

  const handleCreateCategory = async (label: string) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: label }),
      });

      if (!res.ok) throw new Error("Failed to create category");
      const newCategory = await res.json();

      const newOption = { id: newCategory.id, label: newCategory.name };
      setCategories((prev) => [...prev, newOption]);
      setSelectedCategory(newOption);
      setCategory(newCategory.name);
      toast.success(`Category "${label}" created`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      });

      if (!res.ok) throw new Error("Failed to update video");

      toast.success("Video updated successfully!");
      onUpdated();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SquarePen />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
          <DialogDescription>
            Make changes to your video information here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 resize-none"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <div className="mt-2">
              <SelectInput
                options={categories}
                value={selectedCategory}
                onSelect={async (opt) => {
                  if (!opt) return;

                  if (opt.id === "new") {
                    await handleCreateCategory(opt.label);
                  } else {
                    setSelectedCategory(opt);
                    setCategory(opt.label);
                  }
                }}
                placeholder="Select or create category..."
                isLoading={loadingCategories}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
