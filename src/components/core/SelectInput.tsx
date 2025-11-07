"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

export type Option = {
  id: string;
  label: string;
};

interface CreatableComboboxProps {
  options: Option[];
  value?: Option | null;
  placeholder?: string;
  onSelect: (option: Option | null) => void;
  isLoading?: boolean;
}

export function SelectInput({
  options,
  value,
  placeholder = "Pilih atau tambah...",
  onSelect,
  isLoading = false,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const filtered = options.filter((opt) =>
    opt.label?.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[300px] justify-between font-normal"
        >
          {value ? value.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {isLoading ? (
              <p className="p-2 text-sm text-gray-500">Loading...</p>
            ) : (
              <>
                <CommandEmpty>
                  <div className="p-2 text-sm text-gray-500 flex flex-col items-start">
                    <p>No results found.</p>
                    {inputValue.trim() && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 mt-1 text-blue-600"
                        onClick={() => {
                          onSelect({ id: "new", label: inputValue.trim() });
                          setOpen(false);
                        }}
                      >
                        + Create
                      </Button>
                    )}
                  </div>
                </CommandEmpty>

                <CommandGroup>
                  {filtered.map((option) => (
                    <CommandItem
                      key={option.id}
                      onSelect={() => handleSelect(option)}
                      value={option.label}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
