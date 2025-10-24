import { useState, useEffect, type JSX } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../components/ThemeContext";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  MoreHorizontal,
  Eye,
  MessageCircle,
  CheckCircle,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "pending" | "replied" | "resolved";
  createdAt: string;
  updatedAt: string;
}

type ContactStatus = Contact["status"];

interface StatusCounts {
  all: number;
  pending: number;
  replied: number;
  resolved: number;
}

export default function AdminContacts(): JSX.Element {
  const { theme } = useTheme();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Contact>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/contact");
      if (response.ok) {
        const data: Contact[] = await response.json();
        setContacts(data);
      } else {
        throw new Error("Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (
    id: number,
    status: ContactStatus
  ): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/contact/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        setContacts(
          contacts.map((contact) =>
            contact.id === id ? { ...contact, status } : contact
          )
        );
        toast.success("Status updated successfully");
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleSort = (field: keyof Contact): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedContacts = contacts
    .filter((contact: Contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a: Contact, b: Contact) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (sortField === "createdAt" || sortField === "updatedAt") {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === "asc" ? -1 : 1;
      if (bValue === null) return sortDirection === "asc" ? 1 : -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aSafe = aValue ?? "";
      const bSafe = bValue ?? "";

      return sortDirection === "asc"
        ? aSafe < bSafe
          ? -1
          : aSafe > bSafe
          ? 1
          : 0
        : aSafe > bSafe
        ? -1
        : aSafe < bSafe
        ? 1
        : 0;
    });

  const getStatusBadge = (status: ContactStatus): JSX.Element => {
    const statusConfig = {
      pending: {
        variant: "secondary" as const,
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      replied: {
        variant: "default" as const,
        label: "Replied",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      resolved: {
        variant: "default" as const,
        label: "Resolved",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
    };

    const config = statusConfig[status];
    return (
      <Badge
        variant={config.variant}
        className={`capitalize ${config.className}`}
      >
        {config.label}
      </Badge>
    );
  };

  const getStatusCounts = (): StatusCounts => {
    return {
      all: contacts.length,
      pending: contacts.filter((c: Contact) => c.status === "pending").length,
      replied: contacts.filter((c: Contact) => c.status === "replied").length,
      resolved: contacts.filter((c: Contact) => c.status === "resolved").length,
    };
  };

  const statusCounts: StatusCounts = getStatusCounts();

  if (loading) {
    return (
      <div
        className={`
        min-h-screen flex items-center justify-center transition-all duration-500
        ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
            : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
        }
      `}
      >
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
      min-h-screen transition-all duration-500 p-6
      ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
          : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
      }
    `}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Contact Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and respond to customer inquiries
              </p>
            </div>
            <Button onClick={fetchContacts} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card
              className={
                theme === "light"
                  ? "bg-white shadow-lg"
                  : "bg-gray-800 shadow-lg"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statusCounts.all}
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                theme === "light"
                  ? "bg-white shadow-lg"
                  : "bg-gray-800 shadow-lg"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {statusCounts.pending}
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                theme === "light"
                  ? "bg-white shadow-lg"
                  : "bg-gray-800 shadow-lg"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Replied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statusCounts.replied}
                </div>
              </CardContent>
            </Card>
            <Card
              className={
                theme === "light"
                  ? "bg-white shadow-lg"
                  : "bg-gray-800 shadow-lg"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statusCounts.resolved}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card
            className={
              theme === "light" ? "bg-white shadow-lg" : "bg-gray-800 shadow-lg"
            }
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    className={`
                      w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                      ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400"
                          : "bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-500"
                      }
                    `}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="whitespace-nowrap border-2"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={theme === "light" ? "bg-white" : "bg-gray-800"}
                  >
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("all")}
                      className={
                        theme === "light"
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-700"
                      }
                    >
                      All ({statusCounts.all})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("pending")}
                      className={
                        theme === "light"
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-700"
                      }
                    >
                      Pending ({statusCounts.pending})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("replied")}
                      className={
                        theme === "light"
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-700"
                      }
                    >
                      Replied ({statusCounts.replied})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("resolved")}
                      className={
                        theme === "light"
                          ? "hover:bg-gray-100"
                          : "hover:bg-gray-700"
                      }
                    >
                      Resolved ({statusCounts.resolved})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className={
              theme === "light" ? "bg-white shadow-lg" : "bg-gray-800 shadow-lg"
            }
          >
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow
                    className={
                      theme === "light"
                        ? "hover:bg-gray-50 bg-gray-100"
                        : "hover:bg-gray-700 bg-gray-900"
                    }
                  >
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Name
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("subject")}
                    >
                      <div className="flex items-center">
                        Subject
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedContacts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No contact messages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedContacts.map((contact: Contact) => (
                      <TableRow
                        key={contact.id}
                        className={`
                          cursor-pointer transition-all duration-200
                          ${
                            theme === "light"
                              ? "hover:bg-blue-50 border-b border-gray-200"
                              : "hover:bg-gray-700 border-b border-gray-600"
                          }
                          ${
                            contact.status === "pending"
                              ? theme === "light"
                                ? "bg-yellow-50 hover:bg-yellow-100"
                                : "bg-yellow-900/20 hover:bg-yellow-900/30"
                              : ""
                          }
                        `}
                        onClick={() => {
                          setSelectedContact(contact);
                          setIsDetailOpen(true);
                        }}
                      >
                        <TableCell className="font-medium py-4">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {contact.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            {contact.phone && (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Phone className="w-3 h-3 mr-1" />
                                {contact.phone}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="w-3 h-3 mr-1" />
                              {contact.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div
                            className="max-w-[200px] truncate text-gray-900 dark:text-white"
                            title={contact.subject}
                          >
                            {contact.subject}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(contact.status)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(contact.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent) =>
                                  e.stopPropagation()
                                }
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className={
                                theme === "light" ? "bg-white" : "bg-gray-800"
                              }
                            >
                              <DropdownMenuItem
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  setSelectedContact(contact);
                                  setIsDetailOpen(true);
                                }}
                                className={
                                  theme === "light"
                                    ? "hover:bg-gray-100"
                                    : "hover:bg-gray-700"
                                }
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {contact.status !== "replied" && (
                                <DropdownMenuItem
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    updateContactStatus(contact.id, "replied");
                                  }}
                                  className={
                                    theme === "light"
                                      ? "hover:bg-gray-100"
                                      : "hover:bg-gray-700"
                                  }
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Mark as Replied
                                </DropdownMenuItem>
                              )}
                              {contact.status !== "resolved" && (
                                <DropdownMenuItem
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    updateContactStatus(contact.id, "resolved");
                                  }}
                                  className={
                                    theme === "light"
                                      ? "hover:bg-gray-100"
                                      : "hover:bg-gray-700"
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Resolved
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent
            className={`
            max-w-4xl max-h-[85vh] overflow-y-auto p-0 border-0
            ${
              theme === "light"
                ? "bg-white shadow-2xl"
                : "bg-gray-800 shadow-2xl"
            }
          `}
          >
            {selectedContact && (
              <div className="p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Contact Message Details
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Submitted on{" "}
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card
                      className={
                        theme === "light"
                          ? "bg-gray-50 border-2"
                          : "bg-gray-700 border-2"
                      }
                    >
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Full Name
                          </label>
                          <p className="font-semibold text-lg text-gray-900 dark:text-white">
                            {selectedContact.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email Address
                          </label>
                          <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                            {selectedContact.email}
                          </p>
                        </div>
                        {selectedContact.phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Phone Number
                            </label>
                            <p className="font-semibold text-lg text-gray-900 dark:text-white">
                              {selectedContact.phone}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card
                      className={
                        theme === "light"
                          ? "bg-gray-50 border-2"
                          : "bg-gray-700 border-2"
                      }
                    >
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          Message Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Subject
                          </label>
                          <p className="font-semibold text-lg text-gray-900 dark:text-white">
                            {selectedContact.subject}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </label>
                          <div className="mt-2">
                            {getStatusBadge(selectedContact.status)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Last Updated
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(
                              selectedContact.updatedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Message */}
                  <Card
                    className={
                      theme === "light"
                        ? "bg-gray-50 border-2"
                        : "bg-gray-700 border-2"
                    }
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        Message Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`
                        rounded-lg p-6 min-h-[200px] max-h-[300px] overflow-y-auto
                        ${
                          theme === "light"
                            ? "bg-white border border-gray-200"
                            : "bg-gray-600 border border-gray-500"
                        }
                      `}
                      >
                        <p className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
                          {selectedContact.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.open(
                          `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`,
                          "_blank"
                        );
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                    {selectedContact.status !== "replied" && (
                      <Button
                        onClick={() => {
                          updateContactStatus(selectedContact.id, "replied");
                          setIsDetailOpen(false);
                        }}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Mark as Replied
                      </Button>
                    )}
                    {selectedContact.status !== "resolved" && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          updateContactStatus(selectedContact.id, "resolved");
                          setIsDetailOpen(false);
                        }}
                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
