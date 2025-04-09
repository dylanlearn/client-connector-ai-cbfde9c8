
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/ui/colorpicker";
import { fabric } from "fabric";

export interface PropertyPanelProps {
  selectedObject: fabric.Object;
  fabricCanvas: fabric.Canvas | null;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedObject,
  fabricCanvas
}) => {
  const [objectType, setObjectType] = useState<string>("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [fill, setFill] = useState("#000000");
  const [stroke, setStroke] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");

  useEffect(() => {
    if (!selectedObject) return;

    // Determine object type
    let type = selectedObject.type || "unknown";
    setObjectType(type);

    // Set position
    setPosition({
      x: Math.round(selectedObject.left || 0),
      y: Math.round(selectedObject.top || 0)
    });

    // Set size
    if ("width" in selectedObject && "height" in selectedObject) {
      setSize({
        width: Math.round(selectedObject.width || 0),
        height: Math.round(selectedObject.height || 0)
      });
    } else if ("radius" in selectedObject) {
      const radius = (selectedObject as fabric.Circle).radius || 0;
      setSize({
        width: Math.round(radius * 2),
        height: Math.round(radius * 2)
      });
    }

    // Set appearance
    setFill(selectedObject.fill?.toString() || "#000000");
    setStroke(selectedObject.stroke?.toString() || "#000000");
    setStrokeWidth(selectedObject.strokeWidth || 0);
    setOpacity(Math.round((selectedObject.opacity || 1) * 100));

    // Set text properties if it's a text object
    if (type === "textbox" || type === "text" || type === "i-text") {
      const textObj = selectedObject as fabric.Textbox;
      setText(textObj.text || "");
      setFontSize(textObj.fontSize || 16);
      setFontFamily(textObj.fontFamily || "Arial");
    }
  }, [selectedObject]);

  const updateProperty = (property: string, value: any) => {
    if (!selectedObject || !fabricCanvas) return;

    const updateObj: any = {};
    updateObj[property] = value;

    // Special handling for radius in circles
    if (property === "width" && objectType === "circle") {
      updateObj["radius"] = value / 2;
      delete updateObj["width"];
    }

    // Update the object
    selectedObject.set(updateObj);
    fabricCanvas.renderAll();
  };

  const updatePosition = (key: "left" | "top", value: number) => {
    if (!selectedObject || !fabricCanvas) return;

    const newPos = { ...position };
    newPos[key === "left" ? "x" : "y"] = value;
    setPosition(newPos);

    const updateObj: any = {};
    updateObj[key] = value;
    selectedObject.set(updateObj);
    fabricCanvas.renderAll();
  };

  const updateSize = (key: "width" | "height", value: number) => {
    if (!selectedObject || !fabricCanvas) return;

    const newSize = { ...size };
    newSize[key] = value;
    setSize(newSize);

    if (objectType === "circle" && key === "width") {
      selectedObject.set({ radius: value / 2 });
    } else {
      const updateObj: any = {};
      updateObj[key] = value;
      selectedObject.set(updateObj);
    }

    fabricCanvas.renderAll();
  };

  return (
    <Card className="w-full md:w-72 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {objectType.charAt(0).toUpperCase() + objectType.slice(1)} Properties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="position" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="position" className="flex-1">
              Position
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1">
              Style
            </TabsTrigger>
            {(objectType === "textbox" || objectType === "text" || objectType === "i-text") && (
              <TabsTrigger value="text" className="flex-1">
                Text
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="position" className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="position-x">X Position</Label>
                <Input
                  id="position-x"
                  type="number"
                  value={position.x}
                  onChange={(e) => updatePosition("left", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position-y">Y Position</Label>
                <Input
                  id="position-y"
                  type="number"
                  value={position.y}
                  onChange={(e) => updatePosition("top", parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={size.width}
                  onChange={(e) => updateSize("width", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={size.height}
                  onChange={(e) => updateSize("height", parseInt(e.target.value))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 pt-3">
            <div className="space-y-2">
              <Label htmlFor="fill">Fill Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-9 w-9 rounded-md border"
                  style={{ backgroundColor: fill }}
                />
                <Input
                  id="fill"
                  value={fill}
                  onChange={(e) => {
                    setFill(e.target.value);
                    updateProperty("fill", e.target.value);
                  }}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stroke">Stroke Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-9 w-9 rounded-md border"
                  style={{ backgroundColor: stroke }}
                />
                <Input
                  id="stroke"
                  value={stroke}
                  onChange={(e) => {
                    setStroke(e.target.value);
                    updateProperty("stroke", e.target.value);
                  }}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stroke-width">Stroke Width ({strokeWidth}px)</Label>
              <Slider
                id="stroke-width"
                min={0}
                max={20}
                step={1}
                value={[strokeWidth]}
                onValueChange={(values) => {
                  setStrokeWidth(values[0]);
                  updateProperty("strokeWidth", values[0]);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opacity">Opacity ({opacity}%)</Label>
              <Slider
                id="opacity"
                min={0}
                max={100}
                step={1}
                value={[opacity]}
                onValueChange={(values) => {
                  setOpacity(values[0]);
                  updateProperty("opacity", values[0] / 100);
                }}
              />
            </div>
          </TabsContent>

          {(objectType === "textbox" || objectType === "text" || objectType === "i-text") && (
            <TabsContent value="text" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label htmlFor="text">Text Content</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    updateProperty("text", e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size ({fontSize}px)</Label>
                <Slider
                  id="font-size"
                  min={8}
                  max={72}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(values) => {
                    setFontSize(values[0]);
                    updateProperty("fontSize", values[0]);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <select
                  id="font-family"
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    updateProperty("fontFamily", e.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Helvetica">Helvetica</option>
                </select>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyPanel;
