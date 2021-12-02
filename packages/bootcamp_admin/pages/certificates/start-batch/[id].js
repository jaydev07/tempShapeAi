import ImageUpload from '../../../components/ImageUpload';
import Container from 'reactstrap/lib/Container';
import graphQlClient from '../../../configs/ApolloClient.config';
import {
	ADD_CERTIFICATE_EMAIL_TEMPLATES_QUERY,
	CREATE_CERTIFICATE_BATCH_QUERY,
	GET_CERTIFICATE_EMAIL_TEMPLATES_QUERY
} from '../../../gql/courses';
import  { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { useState, useEffect } from 'react';
import Editor from '../../../components/MarkDownEditor/Editor';

const StartBatchPage = () => {
	const router = useRouter();
	const [emailBody, setEmailBody] = useState('');
	const [emailBodyHtml, setEmailBodyHtml] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [emailTemplates, setEmailTemplates] = useState([]);
	const toggleModal = () => setModalOpen(!modalOpen);
	
	const onUpload = async (csv) => {
		try {
			if (!emailBody) return toast.error('Email Body is empty!', { position: 'top-center' });
			await graphQlClient.mutate({
				mutation: CREATE_CERTIFICATE_BATCH_QUERY,
				variables: { certificateTemplate: router.query.id, csv, emailBody: emailBodyHtml },
			});
			return toast.info('Batch queued successfully', { position: 'top-center' });
		} catch (e) {
			toast.error(e.message);
		}
	};
	
	const loadEmailTemplates = async () => {
		try {
			const { data } = await graphQlClient.query({
				query: GET_CERTIFICATE_EMAIL_TEMPLATES_QUERY,
			});
			setEmailTemplates(data.getCertificateEmailTemplates);
		} catch (e) {
			toast.error(e.message);
		}
	};
	
	const createNewCertificateEmailTemplate = async () => {
		const newTemplateName = document.getElementById('new-email-template-name').value;
		if (!newTemplateName)
			return toast.error('Empty template name');
		if (!emailBody.includes('$downloadStatement'))
			return toast.error('Missing required variable: $downloadStatement', {position: 'top-center' });
		const newTemplate = { name: newTemplateName, body: emailBodyHtml, markdown: emailBody };
		try {
			await graphQlClient.mutate({
				mutation: ADD_CERTIFICATE_EMAIL_TEMPLATES_QUERY,
				variables: newTemplate
			});
			setEmailTemplates(emailTemplates.concat(newTemplate));
			toast.info('Template Added Successfully', {
				position: 'top-center',
			});
			toggleModal();
		} catch (e) {
			toast.error(e.message);
		}
	}
	
	useEffect(() => {
		loadEmailTemplates();
	}, []);
	
	return (
		<>
			<Modal
				isOpen={modalOpen}
				toggle={toggleModal}
			>
				<ModalBody>
				<h2>Save a new email body template</h2>
				<FormGroup>
					<Label>
						Template name:
					</Label>
					<Input
						id={'new-email-template-name'}
					/>
					<div dangerouslySetInnerHTML={{ __html: emailBodyHtml }} />
				</FormGroup>
				<Button
					onClick={createNewCertificateEmailTemplate}
					color={'primary'}>
					Save
				</Button>
				</ModalBody>
			</Modal>
			<Container style={{ marginTop: '50px' }} >
				<FormGroup>
					<Label>
					<h3>	Email Body</h3>
						<p style={{ fontSize:'18px' }}>
							Available placeholders: <br/>
							<ol>
								<li>
								[optional]	$name: Replaces with the name of the student
								</li>
								<li>
								[optional] $courseName: Replaces with the course name provided above
								</li>
								<li>
									<b>[REQUIRED]</b> $downloadStatement: Replaces with the statement to download ("To download the certificate, please click <a>here</a>")
								</li>
							</ol>
						</p>
					</Label>
					<FormGroup>
					<Label>
						Saved Email Templates
					</Label>
						<Input
							type={'select'}
							onChange={e => {
								if (e.target.value !== '__skip') {
									const selectedTemplate = emailTemplates.find(t => t.name === e.target.value);
									setEmailBodyHtml(selectedTemplate.body);
									setEmailBody(selectedTemplate.markdown)
								}
							}}
						>
							<option value={'__skip'} >Select Below</option>
							{
								emailTemplates.length > 0 && emailTemplates.map(t => <option value={t.name}>{t.name}</option>)
							}
						</Input>
				</FormGroup>
					<Editor
						setValue={v => setEmailBody(v)}
						value={emailBody}
						getHtml={v => setEmailBodyHtml(v)}
					/>
					<Button
						color={'dark'}
						onClick={() => {
							if (!emailBody.includes('$downloadStatement'))
								return toast.error('Missing required variable: $downloadStatement', {position: 'top-center' });
							toggleModal();
						}}
					>
						Save email body as new template
					</Button>
				</FormGroup>
				<ImageUpload
					purpose={'certBatchCSV'}
					onUploadComplete={d => onUpload(d[0].objectUrl)}
					btnText={'Select CSV'}
					label={'.csv files only'}
					shouldUploadOnDrop={false}
					showPreview={true}
					acceptType={'text/csv'}
					singleImage={true}
					allowedExtensions={['.csv']}
					uploadButtonText={'Create Batch'}
				/>
			</Container>

		
		</>
	)
};


export default StartBatchPage;