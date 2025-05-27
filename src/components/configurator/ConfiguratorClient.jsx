"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SyncLoader } from 'react-spinners';
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { initiateModelGeneration, checkTaskStatus } from "@/actions/api"
import { ErrorBoundary } from "react-error-boundary"
import { LoaderCircle, Eye, ShoppingCart, Send } from 'lucide-react';
import Model from "@/components/configurator/Model"
import {getCookie, setCookie, deleteCookie} from 'cookies-next/client';
import {toast} from "sonner";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ConfiguratorClient(props){
    const user = props.user;
    const {setCsrfToken} = useAuthStore();
    const [formData, setFormData] = useState({
        material: "oak",
        decoration_type: "minimal",
        width: 30,
        height: 20,
        thickness: 15,
        design_description: "",
      })
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(false);
      const [modelStatus, setModelStatus] = useState(null);
      const [modelUrl, setModelUrl] = useState(null);
      const [modelImage, setModelImage] = useState(null);
      const [showPreview, setShowPreview] = useState(true);
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      useEffect(() => {
        const savedModelUrl = getCookie('modelUrl');
        const savedModelImage = getCookie('modelImage');
        const savedFormData = getCookie('formData');

        if (savedModelUrl) {
          setModelUrl(savedModelUrl); 
          setShowPreview(true)
        }
        if (savedModelImage) {
          setModelImage(savedModelImage); 
        }
        if (savedFormData) {
          try {
            const parsedFormData = JSON.parse(savedFormData);
            if (!parsedFormData.material) {
              parsedFormData.material = "oak";
            }
            
            const updatedFormData = {
              ...formData,  
              ...parsedFormData,
            };

            setFormData(updatedFormData);

          } catch(error) {
          }
        }
        // if (savedModelUrl) {
        //   deleteCookie('modelURL')
        //   setModelUrl(null); 
        // }
        // if (savedModelImage) {
        //   deleteCookie('modelImage'); 
        // }
        // if (savedFormData) {
        //   deleteCookie('formData');
        // }
      }, [])  

      const handleChange = (field, value) => {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }))
      }
      const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setModelStatus("Generating your model...");
        setError(null)
        setShowPreview(true)
        document.getElementById('submit').disabled=true;
        try {
          const response = await initiateModelGeneration( formData.design_description, formData.decoration_type, formData.material, formData.height, formData.width, formData.thickness);

          if (!response.success){
            toast.error("Error generating model. Please try again later.");
            setError(response.message);
            console.error(error);
            setLoading(false);
            document.getElementById('submit').disabled = false;
            return;
          }
          const taskId = response.task_id;
          let pollCount = 0;
          const maxPolls = 50;

          const pollTaskStatus = setInterval(
            async () => {
              pollCount++;
              if (pollCount > maxPolls) {
                clearInterval(pollTaskStatus);
                setError("Model generation is taking longer than expected. Please try again later.");
                setLoading(false);
                document.getElementById('submit').disabled = false;
                return;
              }

              const statusResponse = await checkTaskStatus(taskId);

              if (statusResponse.task_status === 'Success') {
                  clearInterval(pollTaskStatus);
                  const modelData = statusResponse.data
                  setModelUrl(modelData.model_url);
                  setModelImage(modelData.thumbnail_url);
                  setCookie('modelUrl', modelData.model_url, { maxAge: 60 * 60 * 24, path: '/' });
                  setCookie('modelImage', modelData.thumbnail_url, { maxAge: 60 * 60 * 24, path: '/' });
                  setCookie('formData', JSON.stringify(formData), { maxAge: 60 * 60 * 24, path: '/' });
                  setLoading(false);
                  document.getElementById('submit').disabled = false;
                  setModelStatus("Model Generation Complete");
                  toast.success("Model generation complete.");
              }else if (statusResponse.task_status === 'Generating') {
                setModelStatus(statusResponse.message || "Generating your model...");
              }
            }, 5000)} 
            catch (error) {
            console.error("Error during model generation:", error);
            toast.error("Error during model generation. Please try again later");
            setLoading(false);
            document.getElementById('submit').disabled = false;
          } 
        }

        const handleProposeDesign = async (user_id, material, decoration_type, design_description, width, height, thickness, estimated_price, model_url, model_image ) => {
            try{
              if(!user_id){
                toast.error("Invalid user ID. Please login and try again");
                return;
              }
              if (!material || !decoration_type || !design_description || !estimated_price || !model_url || !model_image){
                console.error("All fields are required. Please fill in all the details.");
                return;
              }
              const csrfToken = await setCsrfToken();
              const response = await fetch(`${apiURL}/create_design`,
                {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-CSRFToken": csrfToken,
                    },
          
                    body: JSON.stringify({
                      user_id,
                      material,
                      decoration_type,
                      design_description,
                      width,
                      height,
                      thickness,
                      estimated_price,
                      model_url,
                      model_image
                    }),
                    credentials: "include"
                }
              )
              if (response.ok) {
                toast.success("Design proposal submitted successfully.", {
                  action: {
                    label: "View in Profile",
                    onClick: () => redirect("/profile")
                  },
                  duration: 5000
                });
              }else{
                const data = await response.json();
                toast.error("Failed to submit design proposal. Please try again later.");
                console.error(data.message);
                console.log(data); 
              }
            } catch (error) {
              console.error("Error during design proposal:", error);
              toast.error("An error occurred while proposing the design.");
            }
        }

      if (user === null){
        return (
          <div className="pt-22 px-8 pb-8 flex justify-center container mx-auto bg-[var(--background)] ">
            <Card>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold mb-2">You are not logged in</h2>
                  <p className="text-base max-w-150 text-center">Our 3D Product Configurator allows you to customize wooden handicrafts with interactive controls. Please log in to access this feature.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="mt-4 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors" 
                      onClick={() => redirect("/login")}>
                      Login
                    </Button>
                    <Button className="mt-4 border border-[#8B4513] bg-white text-[#8B4513] hover:bg-[#f0e6d9] transition-colors" 
                      onClick={() => redirect("/")}>
                      Back to Home
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }else if (user !== null){
        return(
          <div className="container py-22 px-8 bg-[var(--background)] lg:px-16">
              <div className="mb-5">
              <h2 className="text-2xl font-bold mb-3">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-[var(--primary-color)]">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-[var(--primary-color)]">1</span>
                    </div>
                    <h3 className="font-medium mb-2 text-[var(--primary-color)]">Describe and Design Your Product</h3>
                    <p className="text-sm text-[var(--text-light)]">
                      Use our 3D configurator to describe your design, select materials, dimensions, and decorative elements for your custom wooden
                      piece.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-[var(--primary-color)]">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-[var(--primary-color)]">2</span>
                    </div>
                    <h3 className="font-medium mb-2 text-[var(--primary-color)]">Review & Approve</h3>
                    <p className="text-sm text-[var(--text-light)]">
                      Our craftsmen will review your design and send you a detailed quote and timeline for approval.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-[var(--primary-color)]">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-[var(--primary-color)]">3</span>
                    </div>
                    <h3 className="font-medium mb-2 text-[var(--primary-color)]">Handcrafted Creation</h3>
                    <p className="text-sm text-[var(--text-light)]">
                      Once approved, our skilled artisans will handcraft your custom piece with care and precision.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className= {showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "grid grid-cols-1" }>
              {/* 3D Viewer */}
              {showPreview &&(
              <Tabs defaultValue = "model" className="mb-2">
                <TabsList className="grid w-full grid-cols-2 bg-[var(--light-bg)]">
                  <TabsTrigger value="model">Model</TabsTrigger>
                  <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 ml-1">
                <Checkbox 
                                  id="previewModel" 
                                  checked={showPreview}
                                  onCheckedChange={setShowPreview}
                                />
                        <label 
                          htmlFor="previewModel"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show Preview Model
                        </label>
                      </div>
                
                <TabsContent value="model">
                  <Canvas
                    shadows
                    key={modelUrl || 'default'} 
                    camera={{ position: [5, 5, 5], fov: 50 }}
                    gl={{ preserveDrawingBuffer: true }}
                  >
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <ErrorBoundary 
                      fallback={
                        <Html position={[0, 0, 0]} center>
                          <div className=" p-4 border-0 text-center w-[100vw]">
                            <p className="text-red-600 font-medium mb-2">Failed to load 3D model</p>
                            <button 
                              className="px-3 py-1 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-color)]/80"
                              onClick={() => window.location.reload()}
                            >
                              Retry
                            </button>
                          </div>
                        </Html>
                      }
                      onError={(error) => {
                        console.error("3D Model Error:", error);
                        toast.error("Failed to load 3D model");
                      }}
                    > 
                      {loading ? (
                        <Html center>
                          <div className="flex items-center justify-center">
                            <SyncLoader
                              color="#8B4513"
                              loading={true}
                              size={12}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          </div>
                          <div className="w-[100vw] text-center mt-4">
                            <p>{modelStatus}</p>
                          </div>
                        </Html>
                      ) : (
                        <Model 
                          material={formData.material} 
                          width={formData.width}
                          height={formData.height}
                          thickness={formData.thickness}
                          scale={5} 
                          position={[0, 0.5, 0]} 
                          modelUrl={modelUrl} 
                        />
                      )}
                    </ErrorBoundary>
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={1.5} far={2} />
                    <Environment preset="sunset" />
                    <OrbitControls enableZoom={true} enablePan={true} makeDefault />
                  </Canvas>
                </TabsContent>
                    <TabsContent value="image">
                      <Card>
                        <CardContent>
                          <div className="mt-6">
                            <h3 className="font-medium mb-2">Preview</h3>
                            <div className="grid grid-cols-1">
                              <div className="aspect-square relative rounded-lg overflow-hidden border border-[var(--border-color)]">
                                <Image
                                  src={modelImage ?? "/assets/img/rendered_image.webp?height=300&width=300"}
                                  alt="Product preview - front view"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                                  </Card>
                    </TabsContent>
              </Tabs>)}
            
              {/* Configuration Form */}
              <Card className="order-1 lg:order-2 border border-[var(--border-color)]">
                <CardContent className="p-6">
                  {!showPreview &&(<div className="flex items-center gap-2 ml-1 mb-2">
                <Checkbox 
                                  id="previewModel" 
                                  checked={showPreview}
                                  onCheckedChange={setShowPreview}
                                />
                        <label 
                          htmlFor="previewModel"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show Preview Model
                        </label>
                      </div>)}
                  <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="material" className="mb-6">
                      <TabsList className="grid w-full grid-cols-3 bg-[var(--light-bg)]">
                        <TabsTrigger value="material">Material</TabsTrigger>
                        <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                      </TabsList>
      
                      <TabsContent value="material" className="space-y-6 pt-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="material" className="text-base">
                              Wood Material
                            </Label>
                            <Select 
                              key={formData.material}
                                  defaultValue={formData.material}
                                  value={formData.material} 
                                  onValueChange={(value) => handleChange("material", value)} 
                                >
                              <SelectTrigger className="mt-1.5 w-full border-[var(--border-color)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]">
                              <SelectValue placeholder="Select material">
                        {formData.material ? formData.material.charAt(0).toUpperCase() + formData.material.slice(1) : "Select material"}
                      </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="oak">Oak</SelectItem>
                                <SelectItem value="walnut">Walnut</SelectItem>
                                <SelectItem value="maple">Maple</SelectItem>
                                <SelectItem value="pine">Pine</SelectItem>
                                <SelectItem value="mahogany">Mahogany</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
      
                          <div>
                            <Label className="text-base">Decoration Style</Label>
                            <RadioGroup
                              value={formData.decoration_type}
                              onValueChange={(value) => handleChange("decoration_type", value)}
                              className="grid grid-cols-4 gap-4 mt-1.5"
                            >
                              <Label
                                htmlFor="minimal"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-[var(--border-color)] bg-popover p-4 hover:bg-[var(--light-bg)] hover:text-[var(--text-dark)] [&:has([data-state=checked])]:border-[var(--primary-color)]"
                              >
                                <RadioGroupItem value="minimal" id="minimal" className="sr-only" />
                                <span className="text-center text-lg">Minimal</span>
                              </Label>
                              <Label
                                htmlFor="carved"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-[var(--border-color)] bg-popover p-4 hover:bg-[var(--light-bg)] hover:text-[var(--text-dark)] [&:has([data-state=checked])]:border-[var(--primary-color)]"
                              >
                                <RadioGroupItem value="carved" id="carved" className="sr-only" />
                                <span className="text-center text-lg">Carved</span>
                              </Label>
                              <Label
                                htmlFor="inlaid"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-[var(--border-color)] bg-popover p-4 hover:bg-[var(--light-bg)] hover:text-[var(--text-dark)] [&:has([data-state=checked])]:border-[var(--primary-color)]"
                              >
                                <RadioGroupItem value="inlaid" id="inlaid" className="sr-only" />
                                <span className="text-center text-lg">Inlaid</span>
                              </Label>
                              <Label
                                htmlFor="painted"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-[var(--border-color)] bg-popover p-4 hover:bg-[var(--light-bg)] hover:text-[var(--text-dark)] [&:has([data-state=checked])]:border-[var(--primary-color)]"
                              >
                                <RadioGroupItem value="painted" id="painted" className="sr-only" />
                                <span className="text-center text-lg">Painted</span>
                              </Label>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>
      
                      <TabsContent value="dimensions" className="space-y-6 pt-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="width" className="text-base">
                              Width (cm)
                            </Label>
                            <div className="flex items-center gap-4 mt-1.5">
                              <Slider
                                id="width"
                                min={10}
                                max={100}
                                step={1}
                                value={[formData.width]}
                                onValueChange={(value) => handleChange("width", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-center">{formData.width}</span>
                            </div>
                          </div>
      
                          <div>
                            <Label htmlFor="height" className="text-base">
                              Height (cm)
                            </Label>
                            <div className="flex items-center gap-4 mt-1.5">
                              <Slider
                                id="height"
                                min={5}
                                max={80}
                                step={1}
                                value={[formData.height]}
                                onValueChange={(value) => handleChange("height", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-center">{formData.height}</span>
                            </div>
                          </div>
      
                          <div>
                            <Label htmlFor="thickness" className="text-base">
                            Thickness (cm)
                            </Label>
                            <div className="flex items-center gap-4 mt-1.5">
                              <Slider
                                id="thickness"
                                min={5}
                                max={50}
                                step={1}
                                value={[formData.thickness]}
                                onValueChange={(value) => handleChange("thickness", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-center">{formData.thickness}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
      
                      <TabsContent value="details" className="space-y-6 pt-4">
                        <div>
                          <Label htmlFor="design_description" className="text-base">
                            Design Description
                          </Label>
                          <Textarea required
                            id="design_description"
                            placeholder="Describe any additional details or special requests for your custom design..."
                            className="mt-1.5 h-32 border-[var(--border-color)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                            value={formData.design_description}
                            onChange={(e) => handleChange("design_description", e.target.value)  
                            }
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
      
                    <div className="flex flex-col gap-4">
                      <div className="p-4 bg-[var(--light-bg)] rounded-lg border border-[var(--border-color)]">
                        <h3 className="font-medium mb-2">Price Estimate</h3>
                        <div className="flex justify-between text-lg">
                          <span>Total:</span>
                          <span className="font-bold text-[var(--primary-color)]">
                            ₱{(((formData.width * formData.height * formData.thickness) / 1000) * getMaterialPrice(formData.material)).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-light)] mt-2">
                          Final price may vary based on additional customizations and material availability.
                        </p>
                      </div>
                      
                      <Button 
                        disabled={!formData.design_description} 
                        type="submit" 
                        id="submit" 
                        size="lg" 
                        className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] transition-colors"
                      >
                        {loading && (<LoaderCircle className="animate-spin" size="sm" />)}
                        <Eye />
                        Preview Design
                      </Button>

                      <Button disabled={!modelUrl} 
                      size="lg" className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] transition-colors"
                      type = "button"
                      onClick = {() => {
                        const estimated_price = (((formData.width * formData.height * formData.thickness) / 1000) * getMaterialPrice(formData.material)).toFixed(2);
                        handleProposeDesign(user?.id, formData.material, formData.decoration_type, formData.design_description, formData.width, formData.height, formData.thickness, estimated_price, modelUrl, modelImage)
                      }}>
                      <Send />
                        Propose Design
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
          </div>
        );
      }
    };
const getMaterialPrice = (material) => {
    const prices = {
      oak: 180,     // Premium hardwood
      walnut: 220,  // Expensive imported wood
      maple: 200,   // Premium imported wood
      mahogany: 190,  // Premium hardwood
      pine: 140     // Common softwood, most affordable
    };
  
    return prices[material] || 0;  }
