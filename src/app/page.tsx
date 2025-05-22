
"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";
import {
  PenTool,
  WrapText,
  Expand,
  AlignLeft,
  Smile,
  Copy,
  Loader2,
  Gauge, 
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

import { rewriteText } from "@/ai/flows/rewrite-text";
import { expandText } from "@/ai/flows/expand-text";
import { summarizeText } from "@/ai/flows/summarize-text";
import { changeTextTone } from "@/ai/flows/change-text-tone";
import { analyzeTextSentiment } from "@/ai/flows/analyze-sentiment";
import { generateTitleAndKeywords } from "@/ai/flows/generate-title-keywords";

type Action = "rewrite" | "expand" | "summarize" | "tone" | "sentiment" | "titleKeywords";
type Tone = "Formal" | "Friendly" | "Casual" | "Professional" | "Academic";

const toneOptions: Tone[] = [
  "Formal",
  "Friendly",
  "Casual",
  "Professional",
  "Academic",
];

const toneDisplayMap: Record<Tone, string> = {
  Formal: "Trang trọng",
  Friendly: "Thân thiện",
  Casual: "Thông thường",
  Professional: "Chuyên nghiệp",
  Academic: "Học thuật",
};

const actionDisplayNames: Record<Action, string> = {
  rewrite: "Viết lại",
  expand: "Mở rộng",
  summarize: "Tóm tắt",
  tone: "Giọng điệu",
  sentiment: "Phân tích cảm xúc",
  titleKeywords: "Tiêu đề & Từ khóa",
};

export default function ScribbleGeniusPage() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<Action>("rewrite");
  const [selectedTone, setSelectedTone] = useState<Tone>("Friendly");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleActionChange = (value: string) => {
    setSelectedAction(value as Action);
  };

  const handleToneChange = (value: string) => {
    setSelectedTone(value as Tone);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast({
        title: "Yêu cầu nhập liệu",
        description: "Vui lòng nhập một ít văn bản để xử lý.",
        variant: "destructive",
      });
      return;
    }

    setOutputText("");
    startTransition(async () => {
      try {
        let resultText = "";
        switch (selectedAction) {
          case "rewrite":
            const rewriteResult = await rewriteText({
              text: inputText,
              style: "neutral", // Default style for general rewrite
            });
            resultText = rewriteResult.rewrittenText;
            break;
          case "expand":
            const expandResult = await expandText({ text: inputText });
            resultText = expandResult.expandedText;
            break;
          case "summarize":
            const summarizeResult = await summarizeText({ text: inputText });
            resultText = summarizeResult.summary;
            break;
          case "tone":
            const toneResult = await changeTextTone({
              text: inputText,
              tone: selectedTone,
            });
            resultText = toneResult.changedText;
            break;
          case "sentiment":
            const sentimentResult = await analyzeTextSentiment({ text: inputText });
            resultText = `Cảm xúc: ${sentimentResult.sentiment}\n\nGiải thích: ${sentimentResult.explanation}`;
            break;
          case "titleKeywords":
            const titleKeywordsResult = await generateTitleAndKeywords({ text: inputText });
            resultText = `Tiêu đề đề xuất: ${titleKeywordsResult.generatedTitle}\n\nTừ khóa: ${titleKeywordsResult.generatedKeywords.join(', ')}`;
            break;
          default:
            throw new Error("Hành động không hợp lệ được chọn");
        }
        setOutputText(resultText);
        toast({
          title: "Thành công!",
          description: "Văn bản của bạn đã được xử lý.",
        });
      } catch (error) {
        console.error("AI Action Error:", error);
        toast({
          title: "Lỗi",
          description:
            error instanceof Error ? error.message : "Không thể xử lý văn bản. Vui lòng thử lại.",
          variant: "destructive",
        });
        setOutputText("Đã xảy ra lỗi. Vui lòng kiểm tra console để biết chi tiết.");
      }
    });
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        toast({
          title: "Đã sao chép!",
          description: "Văn bản đầu ra đã được sao chép vào bộ nhớ tạm.",
        });
      })
      .catch((err) => {
        console.error("Copy Error:", err);
        toast({
          title: "Sao chép thất bại",
          description: "Không thể sao chép văn bản vào bộ nhớ tạm.",
          variant: "destructive",
        });
      });
  };

  const actionIcons: Record<Action, React.ReactNode> = {
    rewrite: <WrapText className="mr-2 h-5 w-5" />,
    expand: <Expand className="mr-2 h-5 w-5" />,
    summarize: <AlignLeft className="mr-2 h-5 w-5" />,
    tone: <Smile className="mr-2 h-5 w-5" />,
    sentiment: <Gauge className="mr-2 h-5 w-5" />,
    titleKeywords: <Tags className="mr-2 h-5 w-5" />,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Trợ Lý Viết AI</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-5xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs
              value={selectedAction}
              onValueChange={handleActionChange}
              className="w-full"
            >
              <TabsList className="grid h-auto w-full grid-cols-2 gap-3 bg-transparent p-0 sm:grid-cols-3">
                {(Object.keys(actionIcons) as Action[]).map((action) => (
                  <TabsTrigger key={action} value={action} className="capitalize text-sm flex items-center justify-center">
                    {actionIcons[action]}
                    {actionDisplayNames[action]}
                  </TabsTrigger>
                ))}
              </TabsList>

              <Card className="mt-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Văn bản của bạn</CardTitle>
                  <CardDescription>
                    Nhập văn bản bạn muốn chuyển đổi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Dán hoặc nhập văn bản của bạn tại đây..."
                    value={inputText}
                    onChange={handleInputChange}
                    rows={10}
                    className="resize-none text-base focus:ring-2 focus:ring-primary/50"
                    disabled={isPending}
                  />
                  {selectedAction === "tone" && (
                    <div className="space-y-1.5">
                      <label htmlFor="tone-select" className="text-sm font-medium">Chọn giọng điệu</label>
                      <Select
                        value={selectedTone}
                        onValueChange={handleToneChange}
                        disabled={isPending}
                      >
                        <SelectTrigger id="tone-select" className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Chọn một giọng điệu" />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {toneDisplayMap[tone]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isPending || !inputText.trim()}
                    className="w-full sm:w-auto text-base px-6 py-3"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <SparklesIcon className="mr-2 h-5 w-5" />
                    )}
                    Tạo
                  </Button>
                </CardFooter>
              </Card>
            </Tabs>

            { (outputText || isPending) && (
              <Card className="mt-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Kết quả được tạo</CardTitle>
                   <CardDescription>
                    Đây là phiên bản văn bản do AI tạo ra.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPending ? (
                    <div className="flex items-center justify-center rounded-md border border-dashed p-10 text-muted-foreground">
                       <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Đang xử lý...
                    </div>
                  ) : (
                    <Textarea
                      value={outputText}
                      readOnly
                      rows={10}
                      className="resize-none text-base bg-muted/30 focus:ring-0 whitespace-pre-wrap"
                      placeholder="Văn bản do AI tạo sẽ xuất hiện ở đây..."
                    />
                  )}
                </CardContent>
                {!isPending && outputText && (
                  <CardFooter>
                    <Button
                      variant="outline"
                      onClick={handleCopyToClipboard}
                      className="w-full sm:w-auto text-base"
                    >
                      <Copy className="mr-2 h-5 w-5" />
                      Sao chép vào bộ nhớ tạm
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
          </form>
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-8 border-t">
        <div className="container flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Cung cấp bởi Google Gemini.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trợ Lý Viết AI. Bảo lưu mọi quyền.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper component for SparklesIcon if not available in lucide-react by that name
// Using a generic one for now.
const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L14.09 8.26L20.5 9.5L15.62 13.5L17.27 20L12 16.5L6.73 20L8.38 13.5L3.5 9.5L9.91 8.26L12 2Z" />
    <path d="M5 3L2 5L5 7" />
    <path d="M19 3L22 5L19 7" />
    <path d="M3 17L5 20L7 17" />
    <path d="M21 17L19 20L17 17" />
  </svg>
);
