**Pipeline Overview**

flowchart TD
    A[download_cloudcover_for_training.py]
    B[merge_cloudcover.py]
    C[merge_inmet.py]
    D[merge_cloudcover_and_inmet_3_years.py]
    E[rain_binary.py]
    F[final_model.py]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F

