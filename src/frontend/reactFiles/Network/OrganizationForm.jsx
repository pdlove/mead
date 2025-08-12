import React, { useEffect, useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export default function OrganizationForm({ orgId = null, onSubmit }) {
    const [organization, setOrganization] = useState({
        name: '',
        description: '',
        streetAddress: '',
        phonenumber: '',
        ownerUserID: '',
        technicalContact: '',
        technicalContactEmail: '',
        technicalContactPhone: '',
        technicalContactNotes: '',
        billingContact: '',
        billingContactEmail: '',
        billingContactPhone: '',
        billingContactNotes: '',
        schedulingContact: '',
        schedulingContactEmail: '',
        schedulingContactPhone: '',
        schedulingContactNotes: '',
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://test.tamingit.info/api/data/user')
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (orgId) {
            fetch(`http://test.tamingit.info/api/data/organization/${orgId}`)
                .then((res) => res.json())
                .then((data) => setOrganization(data))
                .catch((err) => console.error(err));
        }
    }, [orgId]);

    const handleChange = (name, value) => {
        setOrganization((prev) => ({
            ...prev,
            [name]: value === 'null' ? null : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = orgId
            ? `http://test.tamingit.info/api/data/organization/${orgId}`
            : `http://test.tamingit.info/api/data/organization`;

        const method = orgId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(organization),
        })
            .then((res) => res.json())
            .then((data) => {
                if (onSubmit) onSubmit(data);
            })
            .catch((err) => console.error(err));
    };

    return (
        <form className="space-y-4">
            <div>
                <label>Name *</label>
                <TextBoxComponent
                    value={organization.name || ''}
                    change={(e) => handleChange('name', e.value)}
                    required
                />
            </div>

            <div>
                <label>Description</label>
                <TextBoxComponent
                    value={organization.description || ''}
                    change={(e) => handleChange('description', e.value)}
                />
            </div>

            <div>
                <label>Street Address</label>
                <TextBoxComponent
                    value={organization.streetAddress || ''}
                    change={(e) => handleChange('streetAddress', e.value)}
                />
            </div>

            <div>
                <label>Phone Number</label>
                <TextBoxComponent
                    value={organization.phonenumber || ''}
                    change={(e) => handleChange('phonenumber', e.value)}
                />
            </div>

            <div>
                <label>Owner User</label>
                <DropDownListComponent
                    dataSource={[{ userID: '', username: '-- No Owner --' }, ...users]}
                    fields={{ text: 'username', value: 'userID' }}
                    value={organization.ownerUserID || ''}
                    change={(e) => handleChange('ownerUserID', e.value)}
                    placeholder="Select Owner"
                />
            </div>

            {/* Contacts - just show a few for brevity */}
            <div>
                <label>Technical Contact</label>
                <TextBoxComponent
                    value={organization.technicalContact || ''}
                    change={(e) => handleChange('technicalContact', e.value)}
                />
            </div>
            <div>
                <label>Technical Contact Email</label>
                <TextBoxComponent
                    value={organization.technicalContactEmail || ''}
                    change={(e) => handleChange('technicalContactEmail', e.value)}
                />
            </div>
            {/* Add the rest similarly... */}

            <ButtonComponent cssClass="e-primary" onClick={handleSubmit}>
                {orgId ? 'Update' : 'Create'}
            </ButtonComponent>
        </form>
    );
}
