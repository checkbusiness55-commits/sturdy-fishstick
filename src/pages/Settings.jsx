import React, { useState } from "react";
import { toast } from "sonner";
import { useSettings, haptic } from "@/lib/settingsContext";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Moon, Sun, Sunset, Palette, Fingerprint, Vibrate, Volume2, Check, Trash2 } from "lucide-react";

const ACCENTS = ["#00E676", "#00B0FF", "#FFD600", "#FF4081", "#B388FF", "#FF6E40"];

function Row({ icon, title, desc, children }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-accent/15 text-app-accent">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { settings, update } = useSettings();
  const { logout } = useAuth();
  const [pinInput, setPinInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.functions.invoke("deleteAccount", {});
      toast("Account deleted");
      logout();
    } catch (e) {
      toast.error("Could not delete account");
      setDeleting(false);
    }
  };

  const modes = [
    { id: "dark", label: "Dark", icon: Moon },
    { id: "light", label: "Light", icon: Sun },
    { id: "auto", label: "Auto", icon: Sunset },
  ];

  return (
    <div className="space-y-4 pt-2 pb-4">
      <h1 className="font-display text-xl font-bold py-2">Settings</h1>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground px-1">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((m) => {
            const active = settings.themeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { update({ themeMode: m.id }); haptic(settings); }}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition ${
                  active ? "border-app-accent bg-app-accent/10 text-app-accent" : "border-border bg-card/70 text-muted-foreground"
                }`}
              >
                <m.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>

        <Row icon={<Palette className="h-5 w-5" />} title="Accent Color" desc="Highlights & active states">
          <div className="flex gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c}
                onClick={() => { update({ accent: c }); haptic(settings); }}
                className="h-7 w-7 rounded-full border-2 flex items-center justify-center transition"
                style={{ backgroundColor: c, borderColor: settings.accent === c ? "white" : "transparent" }}
              >
                {settings.accent === c && <Check className="h-3.5 w-3.5 text-black" />}
              </button>
            ))}
          </div>
        </Row>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground px-1">Security</h2>
        <Row icon={<Fingerprint className="h-5 w-5" />} title="App Lock" desc="Require PIN to open (biometric-style)">
          <Switch
            checked={settings.appLockEnabled}
            onCheckedChange={(v) => {
              if (v && !settings.pin) {
                update({ appLockEnabled: false });
                alert("Set a PIN below first, then enable App Lock.");
              } else {
                update({ appLockEnabled: v });
                haptic(settings);
              }
            }}
          />
        </Row>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-accent/15 text-app-accent">
            <Fingerprint className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Set PIN</p>
            <p className="text-xs text-muted-foreground">4–6 digit passcode</p>
          </div>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
            className="w-24 font-mono text-center"
          />
          <button
            onClick={() => {
              if (pinInput.length >= 4) { update({ pin: pinInput }); setPinInput(""); toast("PIN saved"); }
            }}
            className="rounded-lg bg-app-accent text-black px-3 py-2 text-xs font-semibold"
          >
            Save
          </button>
        </div>

        <Row icon={<Trash2 className="h-5 w-5" />} title="Delete Account" desc="Permanently remove your account">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive px-3 py-2 text-xs font-semibold">
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your account and signs you out. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting…" : "Delete account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground px-1">Feedback</h2>
        <Row icon={<Vibrate className="h-5 w-5" />} title="Haptic Feedback" desc="Vibrate on key actions">
          <Switch checked={settings.hapticEnabled} onCheckedChange={(v) => { update({ hapticEnabled: v }); haptic(v ? settings : null); }} />
        </Row>
        <Row icon={<Volume2 className="h-5 w-5" />} title="Sound Alerts" desc="Audio on price alerts">
          <Switch checked={settings.soundEnabled} onCheckedChange={(v) => update({ soundEnabled: v })} />
        </Row>
      </section>

      <p className="text-center text-xs text-muted-foreground pt-2">Range Pilot · pivot &amp; range analysis</p>
    </div>
  );
}