import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Typography,

} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { createHistory } from "@/features/history/historySlice";
import { Icons } from "@/components/icons/icons";

import SelectUser from "@/components/reusable/selectors/SelectUser";

// Define Zod schema
const schema = z.object({
  date: z.string().min(1, "Date is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  video_url: z
    .string()
    .optional(),
    // .refine(
    //   (val) => !val || val === "" || z.string().url().safeParse(val).success,
    //   {
    //     message: "Invalid video URL",
    //   }
    // ),
  doc_url: z
    .string()
    .optional(),
    // .refine(
    //   (val) => !val || val === "" || z.string().url().safeParse(val).success,
    //   {
    //     message: "Invalid document URL",
    //   }
    // ),
  created_by: z.string().min(1, "Created by is required"),

});

// Infer the form values from Zod schema
type FormValues = z.infer<typeof schema>;

const HistoryManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { createHistoryLoading } = useAppSelector((state) => state.history);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    setValue,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      video_url: "",
      doc_url: "",
      created_by: "",
    },
  });


  useEffect(() => {
    if (selectedUser) {
      setValue("created_by", selectedUser.custID);
    }
  }, [selectedUser, setValue]);

  const onSubmit = (data: FormValues) => {
    const payload:any = {
      date: data.date,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url || "",
      docUrl: data.doc_url || "",
      createdBy: data.created_by,
    };

    dispatch(createHistory(payload)).then((res: any) => {
      if (res.payload.data?.success) {
       
               reset();
        setSelectedUser(null);

      } 
    
 
    
    });
  };

  const resetForm = () => {
    reset();
    setSelectedUser(null);
  };

  // Generate date options for created_date dropdown (last 30 days)
 

  return (
    <div className="overflow-y-auto h-[calc(100vh-72px)]">
      <div className="rounded-sm p-[20px]">
        <Typography variant="h2" fontWeight={500} fontSize={20}>
          Changelog Management
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[20px] grid grid-cols-2 max-w-[70%] gap-[20px]">
            <div className="col-span-2">
                 {/* Title Field */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  variant="filled"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />
            </div>

         

            {/* Description TextField */}
            <div className="col-span-2">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="filled"
                    multiline
                    rows={10}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                )}
              />
            </div>

            {/* Video URL Field */}
            <Controller
              name="video_url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Video URL"
                  variant="filled"
                  error={!!errors.video_url}
                  helperText={errors.video_url?.message}
                  fullWidth
                  placeholder="https://example.com/video.mp4"
                />
              )}
            />

            {/* Doc URL Field */}
            <Controller
              name="doc_url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Document URL"
                  variant="filled"
                  error={!!errors.doc_url}
                  helperText={errors.doc_url?.message}
                  fullWidth
                  placeholder="https://example.com/document.pdf"
                />
              )}
            />

            {/* Created By Dropdown */}
          {/* Date Field with Calendar */}
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  variant="filled"
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
              <SelectUser
             
                value={selectedUser}
                onChange={(value:any) => {
          
                  setSelectedUser(value);
                  if (value) {
                    setValue("created_by", value.custID);
                  } else {
                    setValue("created_by", "");
                  }
                }}
                label="Created By"
                varient="filled"
                error={!!errors.created_by}
                helperText={errors.created_by?.message}
                required
              />
          

          </div>

          <div className="mt-[20px] flex gap-4 flex flex-row-reverse max-w-[70%]">
            <LoadingButton
              startIcon={<Icons.save fontSize="small" />}
              loading={createHistoryLoading}
              type="submit"
              variant="contained"
            >
              Submit
            </LoadingButton>
            <LoadingButton
              startIcon={<Icons.refresh fontSize="small" />}
              onClick={resetForm}
              variant="outlined"
              disabled={createHistoryLoading}
            >
              Reset
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HistoryManagement;

