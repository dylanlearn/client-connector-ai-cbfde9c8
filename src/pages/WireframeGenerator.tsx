
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useWireframeGeneration } from "@/hooks/use-wireframe-generation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, Download, Copy } from "lucide-react";

const WireframeGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [style, setStyle] = useState<string>("modern");
  const {
    isGenerating,
    currentWireframe,
    generateWireframe,
  } = useWireframeGeneration();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    await generateWireframe({
      description: prompt,
      style,
      enhancedCreativity: true,
    });
  };

  const examplePrompt = `Generate a clean, responsive wireframe for a SaaS landing page targeting small businesses. The page should include:

A sticky top navigation bar with logo placeholder, 4 navigation links, and a call-to-action button.

A hero section with a bold headline, supporting text, a main CTA button, and an illustration placeholder.

A features section with 3–4 columns/icons and short descriptions.

A testimonial section with 2 customer quotes and avatar placeholders.

A pricing section with 3 plan cards and a "most popular" badge on the middle one.

A FAQ accordion section with 4 sample questions.

A footer with 4 columns: product links, resources, company info, and social icons.

Keep the layout grid-based and modular, and include notes for spacing, padding, and visual hierarchy.`;

  const handleUseExample = () => {
    setPrompt(examplePrompt);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wireframe Generator</h1>
          <p className="text-muted-foreground">
            Describe your wireframe and our AI will generate a structured
            wireframe layout for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Wireframe</CardTitle>
              <CardDescription>
                Provide a detailed description of the wireframe you need.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={handleStyleChange}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="bold">Bold</option>
                    <option value="classic">Classic</option>
                    <option value="tech">Tech</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Wireframe Description
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    rows={10}
                    placeholder="Describe your wireframe in detail..."
                    className="w-full resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUseExample}
                  >
                    Use Example
                  </Button>
                  <Button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Wireframe
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Wireframe</CardTitle>
              <CardDescription>
                Your wireframe will appear here after generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px]">
              {isGenerating ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : currentWireframe ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {currentWireframe.wireframe.title || "Wireframe"}
                  </h3>
                  <p>{currentWireframe.wireframe.description || ""}</p>

                  <div className="mt-4 border rounded-md p-4 bg-muted/30">
                    <h4 className="font-medium mb-2">Sections:</h4>
                    <ul className="space-y-2">
                      {currentWireframe.wireframe.sections?.map(
                        (section, index) => (
                          <li
                            key={index}
                            className="p-3 bg-background rounded-md border"
                          >
                            <div className="font-medium">{section.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {section.description || section.sectionType}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <p>No wireframe generated yet</p>
                  <p className="text-sm mt-1">
                    Fill out the form and click Generate
                  </p>
                </div>
              )}
            </CardContent>
            {currentWireframe && (
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WireframeGenerator;
