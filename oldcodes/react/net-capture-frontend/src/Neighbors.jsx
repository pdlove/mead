import React, { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
function NeighborTable({ title, neighbors }) {
  return (
    <div>
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>MAC</TableHead>
            <TableHead>Port</TableHead>
            <TableHead>VLAN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {neighbors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No neighbors found
              </TableCell>
            </TableRow>
          ) : (
            neighbors.map((neighbor, i) => (
              <TableRow key={i}>
                <TableCell>{neighbor.device}</TableCell>
                <TableCell>{neighbor.ip}</TableCell>
                <TableCell>{neighbor.mac}</TableCell>
                <TableCell>{neighbor.port}</TableCell>
                <TableCell>{neighbor.vlan}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Neighbors({ lldp = [], cdp = [], stp = [] }) {
  const [tabValue, setTabValue] = useState('lldp');

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Neighbors</h2>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList>
          <TabsTrigger value="lldp">LLDP</TabsTrigger>
          <TabsTrigger value="cdp">CDP</TabsTrigger>
          <TabsTrigger value="stp">STP</TabsTrigger>
        </TabsList>

        <TabsContent value="lldp">
          <NeighborTable title="LLDP Neighbors" neighbors={lldp} />
        </TabsContent>
        <TabsContent value="cdp">
          <NeighborTable title="CDP Neighbors" neighbors={cdp} />
        </TabsContent>
        <TabsContent value="stp">
          <NeighborTable title="STP Neighbors" neighbors={stp} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
