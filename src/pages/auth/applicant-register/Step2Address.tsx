import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import {
  fetchStates,
  fetchDistricts,
  fetchCities,
  addCity,
  type State,
  type District,
  type City,
} from "@/services/masterDataService";
import { Loader2 } from "lucide-react";

const step2Schema = z.object({
  stateId: z.string().min(1, "Please select a state"),
  districtId: z.string().optional(),
  cityId: z.string().min(1, "Please select a city"),
  // Address details for applicant_addresses table
  addressLine1: z.string().trim().optional(),
  addressLine2: z.string().trim().optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter valid 6-digit pincode").optional().or(z.literal("")),
  landmark: z.string().trim().optional(),
  // For "Other" city option
  otherCityName: z.string().optional(),
});

type Step2FormData = z.infer<typeof step2Schema>;

const Step2Address = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showOtherCity, setShowOtherCity] = useState(false);
  const [addingCity, setAddingCity] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
  });

  const stateId = watch("stateId");
  const districtId = watch("districtId");
  const cityId = watch("cityId");
  const otherCityName = watch("otherCityName");

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      const data = await fetchStates();
      setStates(data);
      setLoadingStates(false);
    };
    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (stateId) {
      setLoadingDistricts(true);
      setDistricts([]);
      setCities([]);
      setValue("districtId", "");
      setValue("cityId", "");
      setShowOtherCity(false);
      
      fetchDistricts(stateId).then((data) => {
        setDistricts(data);
        setLoadingDistricts(false);
      });
    }
  }, [stateId, setValue]);

  // Load cities when state or district changes
  useEffect(() => {
    if (stateId) {
      setLoadingCities(true);
      setCities([]);
      setValue("cityId", "");
      setShowOtherCity(false);
      
      fetchCities(stateId, districtId || undefined).then((data) => {
        setCities(data);
        setLoadingCities(false);
      });
    }
  }, [stateId, districtId, setValue]);

  const handleCityChange = (value: string) => {
    if (value === "other") {
      setShowOtherCity(true);
      setValue("cityId", "");
    } else {
      setShowOtherCity(false);
      setValue("cityId", value);
      setValue("otherCityName", "");
    }
  };

  const handleAddCity = async () => {
    if (!otherCityName || !stateId) {
      toast({
        title: "Missing Information",
        description: "Please enter city name and select state",
        variant: "destructive",
      });
      return;
    }

    setAddingCity(true);
    const result = await addCity(otherCityName, stateId, districtId || undefined);
    
    if (result.success && result.cityId) {
      toast({
        title: "City Added",
        description: "City has been added and will be reviewed by admin",
      });
      // Reload cities
      const updatedCities = await fetchCities(stateId, districtId || undefined);
      setCities(updatedCities);
      setValue("cityId", result.cityId);
      setShowOtherCity(false);
      setValue("otherCityName", "");
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add city",
        variant: "destructive",
      });
    }
    setAddingCity(false);
  };

  const onSubmit = (data: Step2FormData) => {
    if (showOtherCity && !data.cityId) {
      toast({
        title: "City Required",
        description: "Please add the city or select an existing one",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("applicant_step2", JSON.stringify(data));
    navigate("/auth/applicant-register/step-3");
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-1");
  };

  const handleSaveLater = () => {
    const data = watch();
    localStorage.setItem("applicant_step2_draft", JSON.stringify(data));
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    navigate("/");
  };

  return (
    <RegistrationLayout
      currentStep={2}
      totalSteps={7}
      stepTitle="Address Details"
      stepSubtitle="Where are you located?"
      onNext={handleSubmit(onSubmit)}
      onPrevious={handlePrevious}
      onSaveLater={handleSaveLater}
    >
      <form className="space-y-6">
        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="stateId">
            State <span className="text-destructive">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue("stateId", value)}
            disabled={loadingStates}
          >
            <SelectTrigger id="stateId">
              <SelectValue placeholder={loadingStates ? "Loading states..." : "Select state"} />
            </SelectTrigger>
            <SelectContent className="bg-background z-50 max-h-60">
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stateId && (
            <p className="text-sm text-destructive">{errors.stateId.message}</p>
          )}
        </div>

        {/* District (Optional) */}
        {districts.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="districtId">
              District (Optional)
            </Label>
            <Select
              onValueChange={(value) => setValue("districtId", value)}
              disabled={loadingDistricts || !stateId}
            >
              <SelectTrigger id="districtId">
                <SelectValue placeholder={loadingDistricts ? "Loading districts..." : "Select district"} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-60">
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="cityId">
            City <span className="text-destructive">*</span>
          </Label>
          {!showOtherCity ? (
            <Select
              onValueChange={handleCityChange}
              disabled={loadingCities || !stateId}
            >
              <SelectTrigger id="cityId">
                <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select city"} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-60">
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other (Add New)</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city name"
                  {...register("otherCityName")}
                  disabled={addingCity}
                />
                <Button
                  type="button"
                  onClick={handleAddCity}
                  disabled={addingCity || !otherCityName}
                >
                  {addingCity ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowOtherCity(false);
                    setValue("otherCityName", "");
                  }}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This city will be reviewed by admin before approval
              </p>
            </div>
          )}
          {errors.cityId && (
            <p className="text-sm text-destructive">{errors.cityId.message}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="space-y-2">
          <Label htmlFor="addressLine1">
            Address Line 1 (Optional)
          </Label>
          <Input
            id="addressLine1"
            placeholder="e.g., House/Flat No., Building Name"
            {...register("addressLine1")}
          />
          {errors.addressLine1 && (
            <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="space-y-2">
          <Label htmlFor="addressLine2">
            Address Line 2 (Optional)
          </Label>
          <Input
            id="addressLine2"
            placeholder="e.g., Street, Area, Locality"
            {...register("addressLine2")}
          />
          {errors.addressLine2 && (
            <p className="text-sm text-destructive">{errors.addressLine2.message}</p>
          )}
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <Label htmlFor="pincode">
            Pincode (Optional)
          </Label>
          <Input
            id="pincode"
            type="text"
            placeholder="Enter 6-digit pincode"
            maxLength={6}
            {...register("pincode")}
          />
          {errors.pincode && (
            <p className="text-sm text-destructive">{errors.pincode.message}</p>
          )}
        </div>

        {/* Landmark */}
        <div className="space-y-2">
          <Label htmlFor="landmark">
            Landmark (Optional)
          </Label>
          <Input
            id="landmark"
            placeholder="e.g., Near Metro Station, Opposite Park"
            {...register("landmark")}
          />
          {errors.landmark && (
            <p className="text-sm text-destructive">{errors.landmark.message}</p>
          )}
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default Step2Address;

