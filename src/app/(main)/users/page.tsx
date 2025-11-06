"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUserStore } from "../../store/user-store";

export default function Users() {
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveUser = async (userId: string) => {
    try {
      const res = await fetch("/api/user/approve", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to approve user");
      }

      toast.success("User Approved Successfully");
      await fetchUser();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  const switchHandler = async (userId: string, currentValue: boolean) => {
    try {
      const res = await fetch("/api/user/can-upload", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, canUpload: !currentValue }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed");
      }

      toast.success("Upload permission updated");
      await fetchUser();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold">List User</h1>
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%] px-4 py-3 text-left">Name</TableHead>
            <TableHead className="w-[15%] px-4 py-3 text-left">Email</TableHead>
            <TableHead className="w-[25%] px-4 py-3 text-center">
              Can Upload
            </TableHead>
            <TableHead className="w-[10%] px-4 py-3 text-left">Role</TableHead>
            <TableHead className="w-[10%] px-4 py-3 text-center">
              Approved
            </TableHead>
            <TableHead className="w-[15%] px-4 py-3 text-center"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {user.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-muted/30 transition-colors text-sm"
            >
              <TableCell className="px-4 py-2 align-middle">
                {item.name}
              </TableCell>
              <TableCell className="px-4 py-2 align-middle">
                {item.email}
              </TableCell>
              <TableCell className="px-4 py-2 text-center align-middle">
                {item.role !== "ADMIN" && item.approved ? (
                  <Switch
                    checked={item.canUpload}
                    onCheckedChange={() =>
                      switchHandler(item.id, item.canUpload)
                    }
                  />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-2 text-left align-middle">
                {item.role}
              </TableCell>
              <TableCell className="px-4 py-2 text-center align-middle">
                {item.approved ? "Yes" : "No"}
              </TableCell>
              <TableCell className="px-4 py-2 text-center align-middle">
                {!item.approved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => approveUser(item.id)}
                    className="mx-auto"
                  >
                    <Check color="green" size={16} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
