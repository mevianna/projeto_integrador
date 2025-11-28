# Pipeline Overview
Here is a useful roadmap of the workflow to prepare the datasets and train the rain prediction model. Each step represents a script: downloading data, cleaning/merging, generating the final binary dataset, and training the model.

   ```mermaid
flowchart TD
    A[download_cloudcover_for_training.py
    ] --> 
    B[merge_cloudcover.py
    ] -->
    C[merge_inmet.py
    ] -->
    D[merge_cloudcover_and_inmet_3_years.py
    ] -->
    E[rain_binary.py
    ] -->
    F[final_model.py
    ]

