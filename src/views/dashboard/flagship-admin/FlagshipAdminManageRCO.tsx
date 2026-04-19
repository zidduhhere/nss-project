import { useState, useEffect, useMemo } from "react";
import { UserPlus, Trash2, Users, Building2, Search, X, ArrowUpDown } from "lucide-react";
import DashboardNavigation from "@/components/common/DashboardNavigation";
import { Footer } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/shadcn/dialog";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Checkbox } from "@/components/shadcn/checkbox";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { useFlagshipAdminRCO } from "@/hooks/useFlagshipAdminRCO";
import { useGeneralServices } from "@/hooks/useGeneralHook";
import { DISTRICT_CODE_TO_NAME } from "@/services/generalService";
import SuccessModal from "@/components/common/SuccessModal";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const FlagshipAdminManageRCO = () => {
  const { rcos, isLoading, isSubmitting, error, successMessage, createRCO, removeRCO, clearMessages } =
    useFlagshipAdminRCO();
  const { colleges, collegesWithUnits } = useGeneralServices();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", allowed_colleges: [] as string[] });
  const [formError, setFormError] = useState<string | null>(null);

  // College picker filters
  const [collegeSearch, setCollegeSearch] = useState("");
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "unit">("name");

  useEffect(() => {
    if (successMessage) { const t = setTimeout(clearMessages, 3000); return () => clearTimeout(t); }
  }, [successMessage, clearMessages]);

  const collegeMap = useMemo(
    () => Object.fromEntries(colleges.map((c) => [c.id, c.name])),
    [colleges]
  );

  // Letters present in full college list
  const availableLetters = useMemo(() => {
    const s = new Set(collegesWithUnits.map((c) => c.name[0]?.toUpperCase()).filter(Boolean));
    return ALL_LETTERS.filter((l) => s.has(l));
  }, [collegesWithUnits]);

  // Distinct districts in display-name form
  const availableDistricts = useMemo(() => {
    const codes = Array.from(new Set(collegesWithUnits.map((c) => c.district).filter(Boolean))).sort();
    return codes.map((code) => ({ code, label: DISTRICT_CODE_TO_NAME[code] ?? code }));
  }, [collegesWithUnits]);

  const filteredColleges = useMemo(() => {
    let result = [...collegesWithUnits];

    if (collegeSearch.trim()) {
      const q = collegeSearch.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (letterFilter) {
      result = result.filter((c) => c.name[0]?.toUpperCase() === letterFilter);
    }
    if (districtFilter && districtFilter !== "all") {
      result = result.filter((c) => c.district === districtFilter);
    }

    if (sortBy === "unit") {
      result.sort((a, b) => {
        if (a.unit_number === null) return 1;
        if (b.unit_number === null) return -1;
        return a.unit_number.localeCompare(b.unit_number, undefined, { numeric: true });
      });
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [collegesWithUnits, collegeSearch, letterFilter, districtFilter, sortBy]);

  const resetFilters = () => {
    setCollegeSearch("");
    setLetterFilter(null);
    setDistrictFilter("all");
    setSortBy("name");
  };

  const hasActiveFilters = collegeSearch || letterFilter || (districtFilter && districtFilter !== "all") || sortBy !== "name";

  const handleCollegeToggle = (collegeId: string) => {
    setForm((prev) => ({
      ...prev,
      allowed_colleges: prev.allowed_colleges.includes(collegeId)
        ? prev.allowed_colleges.filter((id) => id !== collegeId)
        : [...prev.allowed_colleges, collegeId],
    }));
  };

  const handleCreate = async () => {
    setFormError(null);
    if (!form.email || !form.password || !form.full_name) {
      setFormError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (!form.allowed_colleges.length) {
      setFormError("Select at least one college for this RCO.");
      return;
    }
    await createRCO(form);
    if (!error) {
      setIsCreateOpen(false);
      setForm({ email: "", password: "", full_name: "", allowed_colleges: [] });
      resetFilters();
    }
  };

  const handleRemove = async () => {
    if (!confirmRemoveId) return;
    await removeRCO(confirmRemoveId);
    setConfirmRemoveId(null);
  };

  return (
    <div className="font-isans min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavigation mode="flagship-admin" />
      {successMessage && <SuccessModal title="Success" message={successMessage} />}

      <div className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Users className="h-7 w-7 text-primary-600" />
              Manage Regional Coordinators
            </h1>
            <p className="text-gray-500 mt-1">Create and manage RCO accounts for your programme.</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create RCO
          </Button>
        </div>

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <Card>
          <CardHeader>
            <CardTitle>Active RCOs ({rcos.length})</CardTitle>
            <CardDescription>Regional Coordinators can approve certificates from their assigned colleges.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : rcos.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No RCOs yet</p>
                <p className="text-sm mt-1">Create your first Regional Coordinator to delegate approvals.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rcos.map((rco) => (
                  <div key={rco.id} className="flex items-start justify-between p-4 rounded-lg border bg-white gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{rco.full_name || "—"}</p>
                      <p className="text-sm text-muted-foreground truncate">{rco.email}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(rco.allowed_colleges || []).length === 0 ? (
                          <Badge variant="outline" className="text-xs text-muted-foreground">No colleges assigned</Badge>
                        ) : (
                          (rco.allowed_colleges || []).map((cid) => (
                            <Badge key={cid} variant="outline" className="text-xs gap-1">
                              <Building2 className="h-3 w-3" />
                              {collegeMap[cid] || cid}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost" size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 shrink-0"
                      onClick={() => setConfirmRemoveId(rco.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create RCO Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetFilters(); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create Regional Coordinator</DialogTitle>
            <DialogDescription>The RCO will be able to approve certificates from the selected colleges.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input type="email" placeholder="rco@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input type="password" placeholder="Minimum 6 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            {/* College Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Assigned Colleges <span className="text-muted-foreground font-normal">({form.allowed_colleges.length} selected)</span></Label>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear filters
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search college name…"
                  className="pl-8"
                  value={collegeSearch}
                  onChange={(e) => { setCollegeSearch(e.target.value); setLetterFilter(null); }}
                />
              </div>

              {/* District + Sort row */}
              <div className="flex gap-2">
                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger className="flex-1 text-sm">
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {availableDistricts.map(({ code, label }) => (
                      <SelectItem key={code} value={code}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant={sortBy === "unit" ? "default" : "outline"}
                  size="sm"
                  className="shrink-0 gap-1.5 text-xs px-3"
                  onClick={() => setSortBy((s) => s === "unit" ? "name" : "unit")}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {sortBy === "unit" ? "Unit No." : "Name"}
                </Button>
              </div>

              {/* Alphabet strip */}
              <div className="flex flex-wrap gap-0.5">
                {availableLetters.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setLetterFilter((prev) => prev === letter ? null : letter)}
                    className={`w-6 h-6 text-xs font-medium rounded transition-colors
                      ${letterFilter === letter
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* College list */}
              <ScrollArea className="h-52 rounded-md border">
                <div className="p-3 space-y-1.5">
                  {filteredColleges.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-6">No colleges match your filters.</p>
                  ) : (
                    filteredColleges.map((college) => (
                      <div key={college.id} className="flex items-center gap-2.5 py-0.5">
                        <Checkbox
                          id={`college-${college.id}`}
                          checked={form.allowed_colleges.includes(college.id)}
                          onCheckedChange={() => handleCollegeToggle(college.id)}
                        />
                        <label htmlFor={`college-${college.id}`} className="flex-1 text-sm cursor-pointer leading-none flex items-center gap-2">
                          <span className="flex-1">{college.name}</span>
                          {college.unit_number && (
                            <Badge variant="secondary" className="text-xs font-mono shrink-0">
                              Unit {college.unit_number}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs shrink-0 text-muted-foreground">
                            {DISTRICT_CODE_TO_NAME[college.district] ?? college.district}
                          </Badge>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <p className="text-xs text-muted-foreground">
                Showing {filteredColleges.length} of {collegesWithUnits.length} colleges
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create RCO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Dialog */}
      <Dialog open={!!confirmRemoveId} onOpenChange={() => setConfirmRemoveId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove RCO</DialogTitle>
            <DialogDescription>
              This will remove the RCO role. Their account will be downgraded to a student account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmRemoveId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemove}>Remove RCO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default FlagshipAdminManageRCO;
