"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Check,
  ChevronsUpDown,
  Moon,
  Sun,
  SquareGantt,
  Boxes,
  Ruler,
  PaintBucket,
  SquareKanban,
  ListOrderedIcon,
  Settings,
  Volume2,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const NavSwitcher = () => {
  const [open, setOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
      icon: SquareGantt,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
      icon: Volume2,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
      icon: Boxes,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
      icon: Ruler,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeId}/colors`,
      icon: PaintBucket,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
      icon: SquareKanban,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
      icon: ListOrderedIcon,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
      icon: Settings,
    },
  ];
  const formattedItems = routes.map((item) => ({
    label: item.label,
    value: item.href,
    isActive: item.active,
    icon: item.icon,
  }));
  const currentLink = formattedItems.find((item) => !!item.isActive);

  const onLinkSelect = (link: { value: string; label: string }) => {
    setOpen(false);
    router.push(link.value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-label="Select a store"
          className={cn("w-fit gap-1 justify-between lg:hidden")}
        >
          {currentLink?.icon && (
            <currentLink.icon className="mr-2 h-4 w-4 hidden sm:block" />
          )}
          {currentLink?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput name="store" placeholder="Search link..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Nav Links">
              {formattedItems.map((link) => (
                <CommandItem
                  key={link.value}
                  onSelect={() => onLinkSelect(link)}
                  className="text-sm"
                >
                  {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                  {link.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentLink?.value === link.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  if (theme === "dark") {
                    setTheme("light");
                  } else {
                    setTheme("dark");
                  }
                }}
                className="text-black dark:text-white"
              >
                <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="hidden dark:block capitalize">dark mode</span>
                <span className="block dark:hidden capitalize">light mode</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default NavSwitcher;
