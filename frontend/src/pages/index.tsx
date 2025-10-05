import DefaultLayout from "../layouts/default";
import PizzaTable from "../components/PizzaTable";
import Kitchen from "../components/Kitchen";
import OrdersSummary from "../components/OrdersSummary";
import { ToastProvider } from "../components/Utils/ToastProvider";
import { WebSocketProvider } from "../contexts/WebSocketContext";

export default function IndexPage() {
  return (
    <WebSocketProvider>
      <ToastProvider>
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PizzaTable />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <Kitchen />
                <OrdersSummary />
              </div>
            </div>
          </div>
        </section>
      </DefaultLayout>
      </ToastProvider>
    </WebSocketProvider>
  );
}

