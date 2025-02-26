import { useRef, useState } from "react";
import { InputComp } from "./input";
import { Button } from "./button";
import axios from "axios";
import { Loader } from "./loader";
import { X, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Image = "image",
  Audio = "audio",
  Medium = "medium",
  Instagram = "instagram",
}

export const CreateContentModal = ({ open, onClose }: any) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    link?: string;
    type?: string;
  }>({});

  const validateInputs = () => {
    const newErrors: {
      title?: string;
      link?: string;
      type?: string;
    } = {};

    if (!titleRef.current?.value.trim()) {
      newErrors.title = "Title is required";
    }

    if (!linkRef.current?.value.trim()) {
      newErrors.link = "Link is required";
    } else {
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" +
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
          "((\\d{1,3}\\.){3}\\d{1,3}))" +
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
          "(\\?[;&a-z\\d%_.~+=-]*)?" +
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );
      if (!urlPattern.test(linkRef.current?.value.trim())) {
        newErrors.link = "Invalid URL format";
      }
    }

    if (!type) {
      newErrors.type = "Content type is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  async function addcontent() {
    if (!validateInputs()) {
      return;
    }

    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    setLoading(true);

    try {
      const newContent = { title, link, type };

      setContent([...content, newContent]);

      await axios.post(
        "https://secondbrain-5u8x.onrender.com/api/v1/content",
        newContent,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (titleRef.current) titleRef.current.value = "";
      if (linkRef.current) linkRef.current.value = "";
      toast.success("Content added successfully");
      setErrors({});
    } catch (error) {
      console.error("Error adding content:", error);
      // alert("There was an error adding the content. Please try again.");
      toast.warning("There was an error adding the content. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
           <div className="h-screen font-apple w-screen top-0 left-0  bg-opacity-50 fixed bg-slate-500  flex justify-center items-center">
           <span className=" h-custom-h w-custom-h bg-white opacity-100 p-4 rounded-md">
             <div onClick={onClose} className="flex justify-end">
               <Close size="lg" />
             </div>
             <div className="flex justify-center text-3xl font-bold">
               Add Content
             </div>
             <div className=" pt-7">
               <div className=" flex justify-center">

                <div>
                  <InputComp
                    width="full"
                    modal={true}
                    reference={titleRef}
                    placeholder="Content Title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 pl-1">
                      {errors.title}
                    </p>
                  )}
                </div>
              </div>

              <div className=" flex justify-center">
                <div>
                  <InputComp
                    width="full"
                    modal={true}
                    reference={linkRef}
                    placeholder="Paste Link Here"
                  />
                  {errors.link && (
                    <p className="text-red-500 text-xs mt-1 pl-1">
                      {errors.link}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm text-gray-600 font-medium text-center mb-4">
                  Select Content Type
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.values(ContentType).map((contentType) => (
                    <Button
                      key={contentType}
                      size="sm"
                      text={
                        contentType.charAt(0).toUpperCase() +
                        contentType.slice(1)
                      }
                      variant={type === contentType ? "primary" : "secondary"}
                      onClick={() => {
                        setType(contentType);
                        if (errors.type) {
                          setErrors((prev) => ({ ...prev, type: undefined }));
                        }
                      }}
                    />
                  ))}
                </div>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    {errors.type}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={addcontent}
                modalwidth="full"
                center={true}
                variant="primary"
                size="lg"
                modal={true}
                text={loading ? <Loader /> : "Submit Content"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
