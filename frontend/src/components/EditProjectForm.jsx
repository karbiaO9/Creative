import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, AlertCircle, Check } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function EditProjectForm({
  project,
  onSuccess,
  onCancel,
}) {
  const fileInputRef = useRef(null);

  // initialize form state from project prop
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const availableCategories = [
    "UX/UI",
    "Web Design",
    "Logo Design",
    "3D Art",
    "Motion Graphics",
    "Illustration",
    "Branding",
    "Mobile App Design",
  ];

  // on mount: populate initial values
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setSelectedCategories(project.categories);
      setExistingAttachments(project.attachmentsUrls);
    }
  }, [project]);

  // handle file selection (new uploads)
  const handleFiles = (filesList) => {
    const newls = Array.from(filesList).filter(
      (f) =>
        f.type.match("image.*") ||
        f.type.match("video.*")
    );
    setNewFiles((prev) => [...prev, ...newls]);
    // preview
    const previews = newls.map((f) => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("image") ? "image" : "video",
      name: f.name,
    }));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleFileChange = (e) => handleFiles(e.target.files);

  const removeNewFile = (i) => {
    URL.revokeObjectURL(previewUrls[i].url);
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeExisting = (url) =>
    setExistingAttachments((prev) =>
      prev.filter((u) => u !== url)
    );

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const validate = () => {
    if (!title.trim()) return "Title required.";
    if (!description.trim()) return "Description required.";
    if (!selectedCategories.length)
      return "Pick at least one category.";
    return null;
  };

  const uploadFiles = async () => {
    const urls = [];
    for (let f of newFiles) {
      let data = new FormData();
      data.append("files", f);
      const { data: res } = await axiosInstance.post(
        "/file-upload",
        data
      );
      // backend returns: { files: [ ... ] }
      if (res.files && res.files.length)
        urls.push(...res.files);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setIsSubmitting(true);

    try {
      // 1) upload new files
      const newUrls = await uploadFiles();
      // 2) combine with those not removed
      const attachmentsUrls = [
        ...existingAttachments,
        ...newUrls,
      ];
      // 3) call PUT
      await axiosInstance.put(
        `/projects/edit/${project._id}`,
        {
          title,
          description,
          categories: selectedCategories,
          attachmentsUrls,
        }
      );
      setSuccess(true);
      onSuccess && onSuccess();
    } catch (err) {
      console.error("EditProjectForm error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Edit Project
        </h1>
        <p className="text-gray-600">
          Modify your creative work details below
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">
            Project updated successfully!
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategories.includes(cat)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Existing Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keep / Remove Existing Files
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {existingAttachments.map((url) => (
              <div
                key={url}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={url}
                  alt="existing"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  className="absolute top-1 right-1 bg-white/80 p-1 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add More Images/Videos
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary/50"
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragOver={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
              setDragActive(false);
            }}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-700 mb-1">
                Drag & drop files here, or
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-primary font-medium hover:underline"
              >
                Browse files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {previewUrls.map((p, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  {p.type === "image" ? (
                    <img
                      src={p.url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white bg-black">
                      Video
                    </div>
                  )}
                  <button
                    onClick={() => removeNewFile(i)}
                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-5 py-2 border rounded-lg"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
