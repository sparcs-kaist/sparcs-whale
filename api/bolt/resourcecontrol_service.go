package bolt

import (
	"github.com/sparcs-kaist/whale"
	"github.com/sparcs-kaist/whale/bolt/internal"

	"github.com/boltdb/bolt"
)

// ResourceControlService represents a service for managing resource controls.
type ResourceControlService struct {
	store *Store
}

func getBucketNameByResourceControlType(rcType whale.ResourceControlType) string {
	bucketName := containerResourceControlBucketName
	if rcType == whale.ServiceResourceControl {
		bucketName = serviceResourceControlBucketName
	} else if rcType == whale.VolumeResourceControl {
		bucketName = volumeResourceControlBucketName
	}
	return bucketName
}

// ResourceControl returns a resource control object by resource ID
func (service *ResourceControlService) ResourceControl(resourceID string, rcType whale.ResourceControlType) (*whale.ResourceControl, error) {
	var data []byte
	bucketName := getBucketNameByResourceControlType(rcType)
	err := service.store.db.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(bucketName))
		value := bucket.Get([]byte(resourceID))
		if value == nil {
			return nil
		}

		data = make([]byte, len(value))
		copy(data, value)
		return nil
	})
	if err != nil {
		return nil, err
	}
	if data == nil {
		return nil, nil
	}

	var rc whale.ResourceControl
	err = internal.UnmarshalResourceControl(data, &rc)
	if err != nil {
		return nil, err
	}
	return &rc, nil
}

// ResourceControls returns all resource control objects
func (service *ResourceControlService) ResourceControls(rcType whale.ResourceControlType) ([]whale.ResourceControl, error) {
	var rcs = make([]whale.ResourceControl, 0)
	bucketName := getBucketNameByResourceControlType(rcType)
	err := service.store.db.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(bucketName))

		cursor := bucket.Cursor()
		for k, v := cursor.First(); k != nil; k, v = cursor.Next() {
			var rc whale.ResourceControl
			err := internal.UnmarshalResourceControl(v, &rc)
			if err != nil {
				return err
			}
			rcs = append(rcs, rc)
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return rcs, nil
}

// CreateResourceControl creates a new resource control
func (service *ResourceControlService) CreateResourceControl(resourceID string, rc *whale.ResourceControl, rcType whale.ResourceControlType) error {
	bucketName := getBucketNameByResourceControlType(rcType)
	return service.store.db.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(bucketName))
		data, err := internal.MarshalResourceControl(rc)
		if err != nil {
			return err
		}

		err = bucket.Put([]byte(resourceID), data)
		if err != nil {
			return err
		}
		return nil
	})
}

// DeleteResourceControl deletes a resource control object by resource ID
func (service *ResourceControlService) DeleteResourceControl(resourceID string, rcType whale.ResourceControlType) error {
	bucketName := getBucketNameByResourceControlType(rcType)
	return service.store.db.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(bucketName))
		err := bucket.Delete([]byte(resourceID))
		if err != nil {
			return err
		}
		return nil
	})
}
