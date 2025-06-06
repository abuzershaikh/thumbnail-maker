
"use client";

import React, { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScanSearch, Download, Loader2, UsersRound, AlertCircle } from 'lucide-react';
import { extractContacts } from '@/ai/flows/extract-contacts-from-chat';
import { useToast } from "@/hooks/use-toast";

export default function ContactHarvester() {
  const [chatMessages, setChatMessages] = useState<string>("");
  const [extractedContacts, setExtractedContacts] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [extractionAttempted, setExtractionAttempted] = useState<boolean>(false);
  const { toast } = useToast();

  const handleExtractContacts = async () => {
    if (!chatMessages.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste chat messages to extract contacts.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setExtractionAttempted(true);
    try {
      const result = await extractContacts({ chatMessages });
      const uniqueContacts = Array.from(new Set(result.phoneNumbers));
      setExtractedContacts(uniqueContacts);
      setSelectedContacts(new Set()); 
      if (uniqueContacts.length === 0) {
        toast({
          title: "No Contacts Found",
          description: "The AI could not find any unsaved phone numbers in the provided text.",
        });
      } else {
         toast({
          title: "Extraction Successful",
          description: `Found ${uniqueContacts.length} potential contact(s).`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error extracting contacts:", error);
      toast({
        title: "Extraction Failed",
        description: "An error occurred while trying to extract contacts. Please try again.",
        variant: "destructive",
      });
      setExtractedContacts([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = (contactNumber: string) => {
    setSelectedContacts(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(contactNumber)) {
        newSelected.delete(contactNumber);
      } else {
        newSelected.add(contactNumber);
      }
      return newSelected;
    });
  };

  const handleSelectAllContacts = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedContacts(new Set(extractedContacts));
    } else {
      setSelectedContacts(new Set());
    }
  };
  
  const isAllSelected = useMemo(() => {
    return extractedContacts.length > 0 && selectedContacts.size === extractedContacts.length;
  }, [extractedContacts, selectedContacts]);

  const handleExportCsv = () => {
    if (selectedContacts.size === 0) {
      toast({
        title: "No Contacts Selected",
        description: "Please select at least one contact to export.",
        variant: "destructive",
      });
      return;
    }
    setIsExporting(true);
    try {
      const csvHeader = "PhoneNumber\n";
      const csvRows = Array.from(selectedContacts).join("\n");
      const csvContent = csvHeader + csvRows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "wa_contacts.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({
          title: "Export Successful",
          description: "Selected contacts have been downloaded as wa_contacts.csv.",
        });
      } else {
        throw new Error("File download not supported by the browser.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-2">
          <UsersRound className="h-8 w-8 text-primary" />
          WA Contact Harvester
        </CardTitle>
        <CardDescription className="font-body">
          Paste your WhatsApp chat messages below to extract unsaved phone numbers intelligently.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="chat-messages" className="font-body text-base">Chat Messages</Label>
          <Textarea
            id="chat-messages"
            value={chatMessages}
            onChange={(e) => setChatMessages(e.target.value)}
            placeholder="Paste chat messages here..."
            rows={8}
            className="font-body text-sm"
            aria-label="Chat messages input area"
          />
        </div>
        <Button 
          onClick={handleExtractContacts} 
          disabled={isLoading || !chatMessages.trim()} 
          className="w-full sm:w-auto"
          aria-label="Start contact extraction"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ScanSearch className="mr-2 h-5 w-5" />
          )}
          <span className="font-body">Start Extraction</span>
        </Button>

        {extractionAttempted && (
          <div className="space-y-4 pt-4">
            <Separator />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-xl font-semibold font-headline">Extracted Contacts</h3>
              {extractedContacts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAllContacts}
                    aria-label="Select all contacts"
                  />
                  <Label htmlFor="select-all" className="font-body">Select All ({selectedContacts.size}/{extractedContacts.length})</Label>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-72 border rounded-md bg-muted/20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : extractedContacts.length > 0 ? (
              <ScrollArea className="h-72 border rounded-md p-1 bg-muted/20">
                <div className="space-y-1 p-2">
                  {extractedContacts.map((contactNumber, index) => (
                    <div 
                      key={`${contactNumber}-${index}`}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-accent/10 transition-colors"
                    >
                      <Label htmlFor={`contact-${contactNumber}-${index}`} className="flex-grow font-body text-sm cursor-pointer">
                        {contactNumber}
                      </Label>
                      <Checkbox
                        id={`contact-${contactNumber}-${index}`}
                        checked={selectedContacts.has(contactNumber)}
                        onCheckedChange={() => handleSelectContact(contactNumber)}
                        aria-label={`Select contact ${contactNumber}`}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center text-muted-foreground py-10 border rounded-md bg-muted/20 flex flex-col items-center justify-center min-h-[150px]">
                <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground/50"/>
                <p className="font-body">No unsaved phone numbers found.</p>
                <p className="font-body text-xs">Try pasting more messages or ensure they contain phone numbers.</p>
              </div>
            )}

            {extractedContacts.length > 0 && (
              <Button 
                onClick={handleExportCsv} 
                disabled={isExporting || selectedContacts.size === 0} 
                className="w-full sm:w-auto"
                variant="default"
                aria-label="Export selected contacts to CSV"
              >
                {isExporting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Download className="mr-2 h-5 w-5" />
                )}
                <span className="font-body">Export Selected to CSV ({selectedContacts.size})</span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
