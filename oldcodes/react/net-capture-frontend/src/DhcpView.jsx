import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DhcpView({ leases }) {
    if (!leases || leases.length === 0) {
        return (
        <Card className="shadow-lg border border-border bg-background rounded-lg">
            <CardHeader>
            <CardTitle>No DHCP leases found</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
            Please ensure the DHCP server is running and leases are being captured.
            </CardContent>
        </Card>
        );
    }
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">DHCP Leases</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP Address</TableHead>
            <TableHead>MAC Address</TableHead>
            <TableHead>Hostname</TableHead>
            <TableHead>Lease Start</TableHead>
            <TableHead>Lease End</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No DHCP leases found
              </TableCell>
            </TableRow>
          ) : (
            leases.map((lease) => (
              <TableRow key={lease.ip}>
                <TableCell>{lease.ip}</TableCell>
                <TableCell>{lease.mac}</TableCell>
                <TableCell>{lease.hostname || '—'}</TableCell>
                <TableCell>{lease.start}</TableCell>
                <TableCell>{lease.end}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
