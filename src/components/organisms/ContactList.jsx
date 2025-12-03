import React, { useEffect, useState } from "react";
import { getAllContacts, searchContacts } from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import Tag from "@/components/atoms/Tag";
import Button from "@/components/atoms/Button";
import SortFilter from "@/components/molecules/SortFilter";
import SearchBar from "@/components/molecules/SearchBar";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const ContactList = ({ 
  selectedContact, 
  onContactSelect, 
  onAddContact,
  refreshTrigger
}) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await getAllContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [refreshTrigger]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setFilteredContacts(contacts);
        return;
      }

      try {
        const results = await searchContacts(searchQuery);
        setFilteredContacts(results);
      } catch (err) {
        console.error("Search failed:", err);
        setFilteredContacts([]);
      }
    };

    performSearch();
  }, [searchQuery, contacts]);

  useEffect(() => {
    const sortedContacts = [...filteredContacts].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "company":
          return a.company.localeCompare(b.company);
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "updated":
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });
    setFilteredContacts(sortedContacts);
  }, [sortBy, filteredContacts.length]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadContacts} />;
  }

  return (
<div className="w-full h-full space-y-4">
    {/* Header with Sort */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 lg:px-6 py-4">
        <div>
            <h1 className="text-xl font-bold text-gray-900">All Contacts</h1>
            <p className="text-sm text-gray-500 mt-1">
                {filteredContacts.length}contact{filteredContacts.length !== 1 ? "s" : ""}total
                          </p>
        </div>
        <SortFilter sortBy={sortBy} onSortChange={setSortBy} />
    </div>
    {/* Contact Table */}
    <div
className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[400px] lg:h-[calc(100vh-200px)]">
        {filteredContacts.length === 0 ? <div className="p-4 lg:p-8">
            <Empty
                title={searchQuery ? "No contacts found" : "No contacts yet"}
                message={searchQuery ? `No contacts match "${searchQuery}". Try adjusting your search terms.` : "Get started by adding your first contact to begin organizing your professional network."}
                actionLabel="Add Your First Contact"
                onAction={searchQuery ? undefined : onAddContact} />
        </div> : <div className="overflow-x-auto overflow-y-auto h-full">
<div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
<thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                        <th
                            className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[200px]">Name</th>
                        <th
                            className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[150px]">Company</th>
                        <th
                            className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[200px]">Email</th>
                        <th
                            className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[150px]">Phone</th>
                        <th
                            className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[140px]">Position</th>
                        <th
                            className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[200px]">Notes</th>
                        <th
                            className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[160px]">Tags</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredContacts.map(contact => <tr
                        key={contact.id}
                        onClick={() => onContactSelect(contact)}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedContact?.id === contact.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}>
                        <td className="py-3 px-4 min-w-[200px]">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <ApperIcon name="User" size={16} className="text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{contact.position || "No position"}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-3 px-4 min-w-[150px]">
                            <p className="text-sm text-gray-900 truncate">{contact.company || "-"}</p>
                        </td>
                        <td className="py-3 px-4 min-w-[200px]">
                            <p className="text-sm text-gray-900 truncate">{contact.email || "-"}</p>
                        </td>
                        <td className="py-3 px-4 min-w-[150px]">
                            <p className="text-sm text-gray-900 truncate">{contact.phone || "-"}</p>
                        </td>
                        <td className="py-3 px-4 min-w-[140px]">
                            <p className="text-sm text-gray-900 truncate">{contact.position || "-"}</p>
                        </td>
                        <td className="py-3 px-4 min-w-[200px]">
                            <p className="text-sm text-gray-900 truncate" title={contact.notes || ""}>
                                {contact.notes ? contact.notes.length > 50 ? `${contact.notes.substring(0, 50)}...` : contact.notes : "-"}
                            </p>
                        </td>
                        <td className="py-3 px-4 min-w-[160px]">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {contact.tags && contact.tags.length > 0 ? contact.tags.slice(0, 3).map((tag, index) => <Tag key={index} text={tag} size="xs" />) : <span className="text-sm text-gray-400">-</span>}
                                {contact.tags && contact.tags.length > 3 && <span className="text-xs text-gray-500 ml-1">+{contact.tags.length - 3}</span>}
                            </div>
                        </td>
</tr>)}
</tbody>
            </table>
        </div>
        </div>
        }
    </div>
</div>
  );
};

export default ContactList;