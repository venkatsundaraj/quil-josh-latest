"use client";

import { FC, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Icons } from "./icons";
import { useToast } from "./ui/use-toast";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleBar from "simplebar-react";
import { cn } from "@/lib/utils";
import PdfFullscreen from "./pdf-full-screen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

const PdfRenderer: FC<PdfRendererProps> = ({ url }) => {
  const [numberOfPages, setNumberOfPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isPageLoading = renderedScale !== scale;

  const pageNumberValidation = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numberOfPages!),
  });

  type pageNumberValidationType = z.infer<typeof pageNumberValidation>;

  const { toast } = useToast();
  const {
    register,
    formState: { isLoading, errors },
    handleSubmit,
    setValue,
  } = useForm<pageNumberValidationType>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(pageNumberValidation),
  });

  const { ref, width } = useResizeDetector();

  const onSubmit = function ({ page }: pageNumberValidationType) {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  };
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currentPage));
            }}
            disabled={currentPage <= 1}
            variant="ghost"
            aria-label="previous page"
          >
            <Icons.ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              disabled={isLoading}
              autoCapitalize="none"
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(onSubmit)();
                }
              }}
              className={cn(
                "w-12 focus-within:ring-0 focus-within:ring-blue-300",
                {
                  "focus-within:ring-red-500": errors.page,
                }
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numberOfPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={
              numberOfPages === undefined || currentPage === numberOfPages
            }
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numberOfPages! ? numberOfPages! : prev + 1
              );

              setValue("page", String(currentPage));
            }}
            variant="ghost"
            aria-label="next page"
          >
            <Icons.ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                <Icons.Search className="h-4 w-4" />
                {scale * 100}%
                <Icons.ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            aria-label="rotate 90 degrees"
          >
            <Icons.RotateCw className="h-4 w-4" />
          </Button>
          <PdfFullscreen fileUrl={url} />
        </div>
      </div>

      <div className="w-full flex-1 max-h-screen">
        <div ref={ref}>
          <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
            <Document
              loading={
                <div className="flex justify-center">
                  <Icons.Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setNumberOfPages(numPages);
              }}
              file={url}
            >
              {isPageLoading && renderedScale ? (
                <Page
                  scale={scale}
                  pageNumber={currentPage}
                  width={width ? width : 1}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                className={cn(isLoading ? "hidden" : "")}
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Icons.Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
