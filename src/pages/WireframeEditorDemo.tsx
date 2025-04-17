import React from 'react';
import FidelityControls from '@/components/wireframe/controls/FidelityControls';
import FidelityDemo from '@/components/wireframe/fidelity/FidelityDemo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion';
import { AspectRatio } from "@/components/ui/aspect-ratio';
import { Calendar } from "@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useFidelityRenderer } from '@/hooks/wireframe/use-fidelity-renderer';
import { generateMaterialStyles } from '@/components/wireframe/fidelity/FidelityLevels';
import { AspectRatioDemo } from '@/components/ui/aspect-ratio-demo';
import { AlertDialogDemo } from '@/components/ui/alert-dialog-demo';
import { CommandDemo } from '@/components/ui/command-demo';
import { ContextMenuDemo } from '@/components/ui/context-menu-demo';
import { DialogDemo } from '@/components/ui/dialog-demo';
import { HoverCardDemo } from '@/components/ui/hover-card-demo';
import { MenubarDemo } from '@/components/ui/menubar-demo';
import { NavigationMenuDemo } from '@/components/ui/navigation-menu-demo';
import { PopoverDemo } from '@/components/ui/popover-demo';
import { SelectDemo } from '@/components/ui/select-demo';
import { SheetDemo } from '@/components/ui/sheet-demo';
import { TooltipDemo } from '@/components/ui/tooltip-demo';

const data = [
  {
    name: "Pedro Duarte",
    age: 32,
    role: "Frontend Developer",
  },
  {
    name: "Titus Wormer",
    age: 30,
    role: "Backend Developer",
  },
]

const WireframeEditorDemo = () => {
  const { toast } = useToast()
  const { currentLevel, settings } = useFidelityRenderer();
  
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Multi-Level Fidelity Demo
        </h1>
        <ModeToggle />
      </div>
      
      <FidelityDemo />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fidelity Controls</CardTitle>
            <CardDescription>Adjust fidelity settings to see the changes.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Update the prop name from showDetailedControls to showDetailControls */}
            <FidelityControls showDetailControls={true} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Material Styles</CardTitle>
            <CardDescription>Demonstrates the material style generation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div 
                className="w-24 h-24 rounded-md"
                style={generateMaterialStyles(settings.defaultMaterial, settings.surfaceTreatment)}
              />
              <div>
                <p>Current Fidelity: {currentLevel}</p>
                <p>Material: {settings.defaultMaterial}</p>
                <p>Surface: {settings.surfaceTreatment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">UI Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>Basic card component.</CardDescription>
            </CardHeader>
            <CardContent>
              This is a card with some content.
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Text input field.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input type="text" placeholder="Enter text" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Label</CardTitle>
              <CardDescription>Label for form elements.</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="example">Example Label</Label>
              <Input type="text" id="example" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Slider</CardTitle>
              <CardDescription>Range slider.</CardDescription>
            </CardHeader>
            <CardContent>
              <Slider defaultValue={[50]} max={100} step={1} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Switch</CardTitle>
              <CardDescription>Toggle switch.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Table</CardTitle>
              <CardDescription>Data table component.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV0001</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending</Badge>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV0002</TableCell>
                    <TableCell>
                      <Badge variant="outline">Paid</Badge>
                    </TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV0003</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending</Badge>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$100.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Badge</CardTitle>
              <CardDescription>Badge/label component.</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Progress bar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={65} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>User avatar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
              <CardDescription>Placeholder skeleton.</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton width="100%" height="40px" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Accordion</CardTitle>
              <CardDescription>Collapsible content panels.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA specifications and is tested with screen readers and keyboard navigation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled with Radix Themes?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that matches the other components in the library.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It's animated using Radix UI primitives.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Aspect Ratio</CardTitle>
              <CardDescription>Maintains aspect ratio.</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatioDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Date picker.</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !true && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Pick a date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={() => {}}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alert Dialog</CardTitle>
              <CardDescription>Modal alert dialog.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialogDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Command</CardTitle>
              <CardDescription>Command palette.</CardDescription>
            </CardHeader>
            <CardContent>
              <CommandDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Context Menu</CardTitle>
              <CardDescription>Context menu.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContextMenuDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dialog</CardTitle>
              <CardDescription>Modal dialog.</CardDescription>
            </CardHeader>
            <CardContent>
              <DialogDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hover Card</CardTitle>
              <CardDescription>Hover card.</CardDescription>
            </CardHeader>
            <CardContent>
              <HoverCardDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Menubar</CardTitle>
              <CardDescription>Menu bar.</CardDescription>
            </CardHeader>
            <CardContent>
              <MenubarDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>Navigation menu.</CardDescription>
            </CardHeader>
            <CardContent>
              <NavigationMenuDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popover</CardTitle>
              <CardDescription>Popover.</CardDescription>
            </CardHeader>
            <CardContent>
              <PopoverDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Select</CardTitle>
              <CardDescription>Select.</CardDescription>
            </CardHeader>
            <CardContent>
              <SelectDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sheet</CardTitle>
              <CardDescription>Sheet.</CardDescription>
            </CardHeader>
            <CardContent>
              <SheetDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tooltip</CardTitle>
              <CardDescription>Tooltip.</CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipDemo />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Textarea</CardTitle>
              <CardDescription>Textarea.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Type your message here." />
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Toaster />
    </div>
  );
};

export default WireframeEditorDemo;
