import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import Dashboard from './Dashboard';
import InterfaceSelector from './InterfaceSelector';
import Neighbors from './Neighbors';
import DhcpView from './DhcpView';
import './App.css';

function App() {
  const [ws, setWs] = useState(null);
  const [vlans, setVlans] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [interfaces, setInterfaces] = useState([]);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');
    setWs(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'getInitialData' }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'initialData') {
        setVlans(Object.values(msg.data.discoveredVLANs) || []);
        setNodes(Object.values(msg.data.discoveredMACs) || []);
        if (!msg.data.capturing) {
          socket.send(JSON.stringify({ type: 'getDevices' }));
        } else {
          setCapturing(true);
        }
      } else if (msg.type === 'deviceList') {
        setInterfaces(msg.data);
      } else if (msg.type === 'vlan') {
        setVlans(prev => {
          if (prev.some(v => v.id === msg.data.id)) return prev;
          return [...prev, msg.data];
        });
      } else if (msg.type === 'node') {
        setNodes(prev => {
          const idx = prev.findIndex(n => n.mac === msg.data.mac && n.ip === msg.data.ip);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              lastSeen: msg.data.lastSeen,
            };
            return updated;
          }
          return [...prev, msg.data];
        });
      }
    };

    // Cleanup WebSocket on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const handleInterfaceSelect = (ifaceName) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'startCapture', device: ifaceName }));
      setCapturing(true);
    }
  };

  return (
    <div className="App">
      {capturing ? (
        <Tabs defaultValue="arp" className="w-full">
<div className="w-full border-b border-border bg-background">
  <TabsList className="w-full flex justify-start gap-4 px-4">
    <TabsTrigger value="arp" className="flex-1 text-center">ARP</TabsTrigger>
    <TabsTrigger value="neighbors" className="flex-1 text-center">Neighbors</TabsTrigger>
    <TabsTrigger value="dhcp" className="flex-1 text-center">DHCP</TabsTrigger>
  </TabsList>
</div>

          <TabsContent value="arp">
            <Dashboard vlans={vlans} nodes={nodes} />
          </TabsContent>
          <TabsContent value="neighbors">
            <Neighbors />
          </TabsContent>
          <TabsContent value="dhcp">
            <DhcpView />
          </TabsContent>
        </Tabs>
      ) : (
        <InterfaceSelector interfaces={interfaces} onSelect={handleInterfaceSelect} />
      )}
    </div>
  );
}

export default App;
