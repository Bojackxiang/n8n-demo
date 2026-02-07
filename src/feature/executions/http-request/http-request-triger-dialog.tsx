"use client";

import { memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GlobeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { HttpRequestFormValues, httpRequestSchema } from "./http-request.type";

type FormValues = z.infer<typeof httpRequestSchema>;

interface HttpRequestTriggerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  defaultEndpoint?: string;
  defaultMethod?: "GET" | "POST" | "PUT" | "DELETE";
  defaultValues?: Partial<HttpRequestFormValues>;
}

const HttpRequestTriggerDialog = memo(
  ({
    open,
    onClose,
    onSubmit,
    defaultValues = {},
  }: HttpRequestTriggerDialogProps) => {
    const form = useForm<FormValues>({
      resolver: zodResolver(httpRequestSchema),
      defaultValues: {
        endpoint: defaultValues?.endpoint,
        method: defaultValues?.method,
        body: defaultValues?.body,
      },
    });

    const handleSubmit = (values: FormValues) => {
      onSubmit(values);
      onClose();
    };

    useEffect(() => {
      if (open) {
        form.reset({
          endpoint: defaultValues?.endpoint,
          method: defaultValues?.method,
          body: defaultValues?.body,
        });
      }
    }, [open, defaultValues, form]);

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                <GlobeIcon className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-semibold">
                HTTP Request Configuration
              </DialogTitle>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 py-4"
            >
              {/* Endpoint Field */}
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Endpoint URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://api.example.com/endpoint"
                        className="font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Method Field */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      HTTP Method
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Body Field */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Request Body (JSON)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{\n  "key": "value"\n}'
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-border/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105"
                >
                  <span className="relative font-medium">
                    Save Configuration
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);

HttpRequestTriggerDialog.displayName = "HttpRequestTriggerDialog";

export default HttpRequestTriggerDialog;
