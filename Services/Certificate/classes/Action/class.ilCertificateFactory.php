<?php


class ilCertificateFactory
{
	/**
	 * @param ilObject $object
	 * @return ilCertificate
	 * @throws ilException
	 */
	public function create(ilObject $object)
	{
		$type = $object->getType();

		switch ($type) {
			case 'tst':
				$adapter = new ilTestCertificateAdapter($object);
				$placeholderDescriptionObject = new TestPlaceholderDescription();
				$placeholderValuesObject = new TestPlaceHolderValues();
				$certificatePath = ilCertificatePathConstants::TEST_PATH . $object->getId() . '/';
				break;
			case 'crs':
				$adapter = new ilCourseCertificateAdapter($object);
				$placeholderDescriptionObject = new CoursePlaceholderDescription();
				$placeholderValuesObject = new CoursePlaceholderValues();
				$certificatePath = ilCertificatePathConstants::COURSE_PATH . $object->getId() . '/';
				break;
			case 'skl':
				$adapter = new ilSkillCertificateAdapter($object);
				$placeholderDescriptionObject = new ilDefaultPlaceholderDescription();
				$placeholderValuesObject = new ilDefaultPlaceholderValues();
				$certificatePath = ilCertificatePathConstants::SKILL_PATH . $object->getId() . '/';
				break;
			case 'scrm':
				$adapter = new ilSkillCertificateAdapter($object);
				$placeholderDescriptionObject = new ilScormPlaceholderDescription();
				$placeholderValuesObject = new ilScormPlaceholderValues();
				$certificatePath = ilCertificatePathConstants::SCORM_PATH . $object->getId() . '/';
				break;
			case 'exc':
				$adapter = new ilSkillCertificateAdapter($object);
				$placeholderDescriptionObject = new ExercisePlaceholderDescription();
				$placeholderValuesObject = new ilExercisePlaceHolderValues();
				$certificatePath = ilCertificatePathConstants::EXERCISE_PATH . $object->getId() . '/';
				break;
			default:
				throw new ilException(sprintf(
					'The type "%s" is currently not supported for certificates',
					$type
				));
				break;
		}

		$certificate = new ilCertificate(
			$adapter,
			$placeholderDescriptionObject,
			$placeholderValuesObject,
			$object->getId(),
			$certificatePath
		);

		return $certificate;
	}
}
