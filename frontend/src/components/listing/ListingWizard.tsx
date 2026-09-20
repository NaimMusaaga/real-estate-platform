import { useState } from 'react';
import { StepIndicator } from './wizard/StepIndicator';
import { StepPropertyType } from './wizard/StepPropertyType';
import { StepLocation } from './wizard/StepLocation';
import { StepDetails } from './wizard/StepDetails';
import { StepPricing } from './wizard/StepPricing';
import { StepReview } from './wizard/StepReview';
import { INITIAL_DRAFT, buildPayload } from './wizard/types';
import type { ListingDraft } from './wizard/types';
import { PhotoPicker } from './PhotoPicker';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { getErrorMessage } from '../../utils/errors';
import type { CreateListingPayload } from '../../types/listing.types';

const STEP_LABELS = ['نوع العقار', 'الموقع', 'التفاصيل', 'السعر والوصف', 'المراجعة'];

function isStepValid(step: number, draft: ListingDraft, photos: File[]): boolean {
  switch (step) {
    case 0:
      return Boolean(draft.propertyType && draft.transactionType);
    case 1:
      return Boolean(draft.governorateId && draft.cityId && draft.neighborhood.trim());
    case 2:
      if (!draft.areaSqm || Number(draft.areaSqm) <= 0) return false;
      if (draft.propertyType === 'residential') {
        return draft.residential.bedrooms !== '' && draft.residential.bathrooms !== '';
      }
      return true;
    case 3:
      return Boolean(
        draft.title.trim() && draft.description.trim() && (draft.priceSyp || draft.priceUsd) && photos.length >= 1,
      );
    default:
      return true;
  }
}

interface ListingWizardProps {
  onSubmit: (payload: CreateListingPayload, photos: File[]) => Promise<void>;
}

export function ListingWizard({ onSubmit }: ListingWizardProps) {
  const [draft, setDraft] = useState<ListingDraft>(INITIAL_DRAFT);
  const [photos, setPhotos] = useState<File[]>([]);
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function update(patch: Partial<ListingDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleNext() {
    if (!isStepValid(step, draft, photos)) return;
    const nextStep = Math.min(step + 1, STEP_LABELS.length - 1);
    setStep(nextStep);
    setFurthestStep((prev) => Math.max(prev, nextStep));
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit() {
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(buildPayload(draft), photos);
    } catch (err) {
      setError(getErrorMessage(err, 'حدث خطأ أثناء نشر الإعلان'));
    } finally {
      setSubmitting(false);
    }
  }

  const isLastStep = step === STEP_LABELS.length - 1;
  const canProceed = isStepValid(step, draft, photos);

  return (
    <div>
      <StepIndicator steps={STEP_LABELS} currentStep={step} furthestStep={furthestStep} onStepClick={setStep} />

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <div className="min-h-[280px]">
        {step === 0 && <StepPropertyType draft={draft} update={update} />}
        {step === 1 && <StepLocation draft={draft} update={update} />}
        {step === 2 && <StepDetails draft={draft} update={update} />}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <StepPricing draft={draft} update={update} />
            <PhotoPicker files={photos} onChange={setPhotos} />
          </div>
        )}
        {step === 4 && <StepReview draft={draft} />}
      </div>

      <div className="mt-8 flex justify-between border-t border-stone-100 pt-6">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          السابق
        </Button>
        {isLastStep ? (
          <Button onClick={handleSubmit} isLoading={submitting}>
            نشر الإعلان
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed}>
            التالي
          </Button>
        )}
      </div>
    </div>
  );
}
