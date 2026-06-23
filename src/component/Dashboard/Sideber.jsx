

import { auth } from "@/lib/auth";
import { Bars, Bell, Envelope, Gear, House, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function DashBoardSideber() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  const user = session?.user
  const role = session?.role
  console.log(user)

  const dashBoardItams = {
    user: [
      { icon: House, label: "Overview", Link: "/dashboard/user" },
      { icon: Magnifier, label: "My Recipes", Link: "/dashboard/user/myrecipes" },
      { icon: House, label: "Add Recipe", Link: "/dashboard/user/addrecipe" },
      { icon: House, label: "My purchased recipes", Link: "/dashboard/user/mypurchasedrecipes" },
      { icon: House, label: "My Favorites", Link: "/dashboard/user/myfavorites" },
      { icon: Person, label: "Profile", Link: "/dashboard/user/Profile" }
    ],
    admin: [
      { icon: House, label: "Overview", Link: "/dashboard/admin" },
      { icon: House, label: "Manage Users", Link: "/dashboard/admin/manageusers" },
      { icon: Magnifier, label: "Manage Recipes", Link: "/dashboard/admin/managerecipes" },
      { icon: House, label: "Reports", Link: "/dashboard/admin/reports" },
      { icon: House, label: "Transaction", Link: "/dashboard/admin/transaction" },

    ],

  }

  const navItems = dashBoardItams[user?.role] || [];



  return (
    <Drawer>
      <Button variant="secondary" className={'hidden'}>
        <Bars />
        Menu
      </Button>

      <nav className="flex flex-col gap-1">


        <Image
          width={100}
          height={300}
          src="/Logo.png"
          alt="logo"
          className="object-contain dark:invert"
        />
        {navItems.map((item) => (
          <Link key={item.label} href={item.Link}>
            <button

              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
              type="button"
            >
              <item.icon className="size-5 text-muted" />
              {item.label}
            </button>
          </Link>
        ))}
      </nav>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link key={item.label}  href={item.Link}>
                    <button

                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                      type="button"
                    >
                      <item.icon className="size-5 text-muted" />
                      {item.label}
                    </button>
                  </Link>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}