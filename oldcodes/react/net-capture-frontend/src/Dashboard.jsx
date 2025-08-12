import { useState } from 'react';
import './App.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

function Dashboard({ vlans, nodes }) {
    const [selectedVlan, setSelectedVlan] = useState(null);

    const filteredNodes = selectedVlan
        ? nodes.filter(n => n.vlanId === selectedVlan)
        : nodes;

    const macCounts = nodes.reduce((acc, node) => {
        acc[node.vlanId] = (acc[node.vlanId] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="flex space-x-6">
            {/* VLANs Table */}
            <Card className="flex-1 shadow-lg border border-border bg-background rounded-lg">
                <CardHeader>
                    <CardTitle>VLANs Discovered</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[600px]">
                    <Table className="w-full border-collapse">
                        <TableHeader className="sticky top-0 bg-background/90 backdrop-blur-sm z-10 border-b border-border">
                            <TableRow>
                                <TableHead className="p-3 text-left font-semibold">VLAN ID</TableHead>
                                <TableHead className="p-3 text-left font-semibold">Example IP</TableHead>
                                <TableHead className="p-3 text-left font-semibold">Discovery Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vlans.map(vlan => (
                                <TableRow
                                    key={vlan.vlanId}
                                    className={`p-3 border-b cursor-pointer ${vlan.vlanId === selectedVlan ? 'selected bg-accent text-accent-foreground' : 'even:bg-muted hover:bg-accent/30'}`}
                                    onClick={() => setSelectedVlan(vlan.vlanId === selectedVlan ? null : vlan.vlanId)}
                                >
                                    <TableCell>{vlan.vlanId}</TableCell>
                                    <TableCell>{vlan.exampleIp}</TableCell>
                                    <TableCell>{macCounts[vlan.vlanId] || 0}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Nodes Table */}
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Nodes Discovered (Sorted by IP)</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[600px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>MAC Address</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>VLAN</TableHead>
                                <TableHead>First Seen</TableHead>
                                <TableHead>Last Seen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNodes
                                .sort((a, b) => a.ip.localeCompare(b.ip))
                                .map((node, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{node.ip}</TableCell>
                                        <TableCell>{node.mac}</TableCell>
                                        <TableCell>{node.vlanId}</TableCell>
                                        <TableCell>{new Date(node.firstSeen).toLocaleTimeString()}</TableCell>
                                        <TableCell>{new Date(node.lastSeen).toLocaleTimeString()}</TableCell>
                                    </TableRow >
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
export default Dashboard;