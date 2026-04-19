import { useState, useEffect } from "react";
import { UserPlus, Trash2, Users, RefreshCw, Building2 } from "lucide-react";
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
import { useFlagshipAdminRCO } from "@/hooks/useFlagshipAdminRCO";
import { useGeneralServices } from "@/hooks/useGeneralHook";
import SuccessModal from "@/components/common/SuccessModal";

const FlagshipAdminManageRCO = () => {
  const { rcos, isLoading, isSubmitting, error, successMessage, createRCO, removeRCO, clearMessages } =
    useFlagshipAdminRCO();
  const { colleges } = useGeneralServices();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", allowed_colleges: [] as string[] });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) { const t = setTimeout(clearMessages, 3000); return () => clearTimeout(t); }
  }, [successMessage, clearMessages]);

  const collegeMap = Object.fromEntries(colleges.map((c) => [c.id, c.name]));

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
    }
  };

  const handleRemove = async () => {
    if (!confirmRemoveId) return;
    await removeRCO(confirmRemoveId);
    setConfirmRemoveId(null);
  };

  return (
    <div className="font-isans min-h-screen bg-gray-50">
      <DashboardNavigation mode="flagship-admin" />
      {successMessage && <SuccessModal title="Success" message={successMessage} />}

      <div className="container mx-auto px-4 py-8 space-y-6">
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
                      className="text-blood-600 hover:text-blood-800 hover:bg-blood-50 shrink-0"
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
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Regional Coordinator</DialogTitle>
            <DialogDescription>The RCO will be able to approve certificates from the selected colleges.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
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
            <div className="space-y-1">
              <Label>Password</Label>
              <Input type="password" placeholder="Minimum 6 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Assigned Colleges ({form.allowed_colleges.length} selected)</Label>
              <ScrollArea className="h-48 rounded-md border p-3">
                <div className="space-y-2">
                  {colleges.map((college) => (
                    <div key={college.id} className="flex items-center gap-2">
                      <Checkbox
                        id={college.id}
                        checked={form.allowed_colleges.includes(college.id)}
                        onCheckedChange={() => handleCollegeToggle(college.id)}
                      />
                      <label htmlFor={college.id} className="text-sm cursor-pointer leading-none">{college.name}</label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="gap-2">
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

      <div className="mt-16"><Footer /></div>
    </div>
  );
};

export default FlagshipAdminManageRCO;
