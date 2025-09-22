import DefaultLayout from "../layouts/default";
import PizzaTable from "../components/PizzaTable";
import Kitchen from "../components/Kitchen";
import { WebSocketProvider } from "../contexts/WebSocketContext";

export default function IndexPage() {
  return (
    <WebSocketProvider>
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PizzaTable />
              </div>
              <div className="lg:col-span-1">
                <Kitchen />
              </div>
            </div>
          </div>
        </section>
      </DefaultLayout>
    </WebSocketProvider>
  );
}

